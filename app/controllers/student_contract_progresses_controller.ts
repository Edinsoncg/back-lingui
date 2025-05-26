import type { HttpContext } from '@adonisjs/core/http'
import Student from '#models/student'
import StudentContract from '#models/student_contract'
import StudentAttendance from '#models/student_attendance'
import { DateTime } from 'luxon'

export default class StudentContractProgressesController {
  public async list({ request, response }: HttpContext) {
    const studentCode = request.input('student_code')

    if (!studentCode) {
      return response.ok({
        student: null,
        contracts: [],
        attendances: [],
      })
    }

    const student = await Student.query()
      .where('student_code', studentCode)
      .preload('status')
      .preload('contracts', (contractQuery) => {
        contractQuery.preload('contract')
      })
      .first()

    if (!student) {
      return response.notFound({ message: 'Estudiante no encontrado' })
    }

    // Traer todas las asistencias con sus sesiones
    const attendances = await StudentAttendance.query()
      .where('student_id', student.id)
      .preload('classroomSession')

    // Rango de fechas actual
    const now = DateTime.now()
    const startOfWeek = now.startOf('week')
    const startOfMonth = now.startOf('month')

    // 1. Filtrar solo asistencias de esta semana
    const weeklyAttendances = attendances.filter(
      (attendance) => attendance.classroomSession?.start_at > startOfWeek
    )

    // 2. Sumar duración total semanal
    const weeklyHours = weeklyAttendances.reduce(
      (sum, attendance) => sum + (attendance.classroomSession?.duration ?? 0),
      0
    )

    const weeklySessions = weeklyAttendances.length

    // 3. De las sesiones semanales, tomar solo las que también son del mes actual
    const monthlyAttendances = attendances.filter(
      (attendance) => attendance.classroomSession?.start_at > startOfMonth
    )

    const monthlyHours = monthlyAttendances.reduce(
      (sum, attendance) => sum + (attendance.classroomSession?.duration ?? 0),
      0
    )
    const monthlySessions = monthlyAttendances.length

    // 4. Total de horas acumuladas sin importar fechas
    const totalHours = attendances.reduce(
      (sum, attendance) => sum + (attendance.classroomSession?.duration ?? 0),
      0
    )

    const executedWeeks = weeklyHours > 0 ? totalHours / weeklyHours : 0
    const executedMonths = monthlyHours > 0 ? totalHours / monthlyHours : 0

    return response.ok({
      student,
      attendances,
      progress: {
        weekly_hours_completed: weeklyHours,
        weekly_sessions_completed: weeklySessions,
        monthly_hours_completed: monthlyHours,
        monthly_sessions_completed: monthlySessions,
        total_hours_completed: totalHours,
        executed_weeks: executedWeeks,
        executed_months: executedMonths,
      },
    })
  }

// recuerde hacer los controladores, rutas y services de contract y status

  public async update({ request, response }: HttpContext) {
    const {
      student_id,
      new_status_id,
      new_start_date,
      new_contract_id,
    } = request.only([
      'student_id',
      'new_status_id',
      'new_start_date',
      'new_contract_id',
    ])

    const student = await Student.findOrFail(student_id)
    student.statusId = new_status_id
    await student.save()

    const currentContract = await StudentContract.query()
      .where('student_id', student.id)
      .orderBy('created_at', 'desc')
      .firstOrFail()

    if (new_start_date) {
      currentContract.startDate = DateTime.fromISO(new_start_date)
    }

    if (new_contract_id) {
      currentContract.contractId = new_contract_id
    }

    await currentContract.save()

    return response.ok({ message: 'Datos del contrato actualizados correctamente.' })
  }
}
