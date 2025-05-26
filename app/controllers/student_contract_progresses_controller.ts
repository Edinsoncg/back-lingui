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
      (attendance) => attendance.classroomSession?.startAt > startOfWeek
    )

    // 2. Sumar duración total semanal
    const weeklyHours = weeklyAttendances.reduce(
      (sum, attendance) => sum + (attendance.classroomSession?.duration ?? 0),
      0
    )

    // 3. De las sesiones semanales, tomar solo las que también son del mes actual
    const monthlyHours = weeklyAttendances
      .filter((attendance) => attendance.classroomSession?.startAt > startOfMonth)
      .reduce((sum, attendance) => sum + (attendance.classroomSession?.duration ?? 0), 0)

    return response.ok({
      student,
      attendances,
      progress: {
        weekly_hours_completed: weeklyHours,
        monthly_hours_completed: monthlyHours,
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
