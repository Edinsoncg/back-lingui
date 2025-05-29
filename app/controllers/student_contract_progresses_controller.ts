// ✅ CONTROLADOR: student_contract_progresses_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import Student from '#models/student'
import StudentContract from '#models/student_contract'
import StudentAttendance from '#models/student_attendance'
import Contract from '#models/contract'

export default class StudentContractProgressesController {
  public async list({ request, response }: HttpContext) {
    const studentCode = request.input('student_code')
    if (!studentCode) {
      return response.ok({ student: null, attendances: [], progress: {} })
    }

    const student = await Student.query()
      .where('student_code', studentCode)
      .preload('user')
      .preload('status')
      .preload('contracts', (query) => query.preload('contract').orderBy('created_at', 'desc'))
      .first()

    if (!student) {
      return response.notFound({ message: 'Estudiante no encontrado' })
    }

    const activeContract = student.contracts?.[0]
    const contractType = activeContract?.contract

    if (!activeContract || !contractType) {
      return response.badRequest({ message: 'Contrato activo no encontrado' })
    }

    const attendances = await StudentAttendance.query()
      .where('student_contract_id', activeContract.id)
      .preload('classroomSession')

    const now = new Date()
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay())

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const weeklyAttendances = attendances.filter((attendance) => attendance.classroomSession?.start_at > startOfWeek)
    const monthlyAttendances = attendances.filter((attendance) => attendance.classroomSession?.start_at > startOfMonth)

    const sumDurations = (items: typeof attendances) =>
      items.reduce((sum, a) => sum + (a.classroomSession?.duration || 0), 0)

    const weeklyHours = sumDurations(weeklyAttendances)
    const weeklySessions = weeklyAttendances.length
    const monthlyHours = sumDurations(monthlyAttendances)
    const monthlySessions = monthlyAttendances.length
    const totalHours = sumDurations(attendances)

    const weekLimit = contractType.hour_amount_week
    const monthLimit = weekLimit * 4

    const weeklyPercent = weekLimit ? Math.min((weeklyHours / weekLimit) * 100, 100) : 0
    const monthlyPercent = monthLimit ? Math.min((monthlyHours / monthLimit) * 100, 100) : 0

    // Porcentaje de tiempo de contrato transcurrido
    let date_percent = 0
    const start = activeContract.start_date
    const end = activeContract.end_date
    const nowTime = now.getTime()
    if (start && end && nowTime >= start.getTime()) {
      const total = end.getTime() - start.getTime()
      const transcurrido = nowTime - start.getTime()
      date_percent = total > 0 ? Math.min((transcurrido / total) * 100, 100) : 0
    }

    return response.ok({
      student: {
        id: student.id,
        code: student.student_code,
        full_name: `${student.user.first_name} ${student.user.first_last_name}`,
        status: student.status,
        contract: contractType,
        contracts: student.contracts,
      },
      attendances,
      progress: {
        weekly_hours_completed: weeklyHours,
        weekly_sessions_completed: weeklySessions,
        weekly_percent: weeklyPercent,
        monthly_hours_completed: monthlyHours,
        monthly_sessions_completed: monthlySessions,
        monthly_percent: monthlyPercent,
        total_hours_completed: totalHours,
        date_percent: date_percent,
      },
    })
  }

  public async update({ request, response }: HttpContext) {
    const { student_id, new_status_id, new_start_date, new_contract_id } = request.only([
      'student_id',
      'new_status_id',
      'new_start_date',
      'new_contract_id',
    ])

    const student = await Student.findOrFail(student_id)
    student.status_id = new_status_id
    await student.save()

    const currentContract = await StudentContract.query()
      .where('student_id', student.id)
      .orderBy('created_at', 'desc')
      .firstOrFail()

    if (new_contract_id) {
      currentContract.contract_id = new_contract_id
    }

    if (new_start_date) {
      const newStartDate = new Date(new_start_date)
      currentContract.start_date = newStartDate

      // Usamos el contrato actualizado para obtener los meses correctos
      const contract = await Contract.findOrFail(currentContract.contract_id)
      const mounth = contract.month_amount
      const newEndDate = new Date(newStartDate)
      newEndDate.setMonth(newEndDate.getMonth() + mounth)
      currentContract.end_date = newEndDate
    }

    await currentContract.save()

    return response.ok({ message: 'Datos del contrato actualizados correctamente.' })
  }
}
