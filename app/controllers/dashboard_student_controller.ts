// app/controllers/dashboard_student_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import Student from '#models/student'
import StudentAttendance from '#models/student_attendance'
import ClassroomSession from '#models/classroom_session'

export default class DashboardStudentController {
  public async index({ auth, response }: HttpContext) {
    const user = auth.user!

    // Obtener el estudiante asociado al usuario
    const student = await Student.query()
      .where('user_id', user.id)
      .preload('contracts', (q) => q.orderBy('created_at', 'desc'))
      .preload('studentLevels', (q) => q.where('is_current', true).preload('level'))
      .firstOrFail()

    const activeContract = student.contracts.find((c) => {
      const now = new Date()
      return new Date(c.start_date.toString()) <= now && new Date(c.end_date.toString()) >= now
    })

    const today = new Date()
    const startOfToday = new Date(today)
    startOfToday.setHours(0, 0, 0, 0)

    const endOfToday = new Date(today)
    endOfToday.setHours(23, 59, 59, 999)

    // Clases programadas para hoy (donde haya asistencia registrada del estudiante)
    let clasesHoy: {
      id: number
      hour: string
      classroom: string | undefined
      level: string | undefined
    }[] = []

    if (activeContract) {
      const asistenciasHoy = await StudentAttendance.query()
        .where('student_contract_id', activeContract.id)
        .whereBetween('created_at', [startOfToday, endOfToday])
        .preload('classroomSession', (q) =>
          q.preload('classroom').preload('unit', (innerQ) => innerQ.preload('level'))
        )

      clasesHoy = asistenciasHoy.map((a) => ({
        id: a.id,
        hour: a.classroomSession?.start_at
          ? new Date(a.classroomSession.start_at).toISOString().substring(11, 16)
          : '',
        classroom: a.classroomSession?.classroom?.name,
        level: a.classroomSession?.unit?.level?.name,
      }))
    }

    // Porcentaje de asistencia
    let porcentajeAsistencia = 0

    if (activeContract) {
      // 1. Todas las asistencias del contrato
      const asistencias = await StudentAttendance.query().where(
        'student_contract_id',
        activeContract.id
      )

      const classroomSessionIds = asistencias.map((a) => a.classroom_session_id)

      // 2. Todas las clases de esas asistencias que ya han ocurrido
      const clasesProgramadas = await ClassroomSession.query()
        .whereIn('id', classroomSessionIds)
        .where('start_at', '<=', new Date())

      porcentajeAsistencia =
        clasesProgramadas.length > 0
          ? Math.round((asistencias.length / clasesProgramadas.length) * 10)
          : 0
    }

    // Nivel actual
    const nivelActual = student.studentLevels[0]?.level?.name || null

    // Gráfico de asistencia (últimos 7 días)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(today.getDate() - 6)
    sevenDaysAgo.setHours(0, 0, 0, 0)

    const recientes = await StudentAttendance.query()
      .where('student_contract_id', activeContract?.id || 0)
      .where('created_at', '>=', sevenDaysAgo.toISOString())

    const attendanceByDay: Record<string, number> = {}

    for (let i = 0; i < 7; i++) {
      const date = new Date(sevenDaysAgo)
      date.setDate(date.getDate() + i)
      const key = date.toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric' })
      attendanceByDay[key] = 0
    }

    for (const attendance of recientes) {
      const date = new Date(attendance.createdAt.toString())
      const key = date.toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric' })
      if (attendanceByDay[key] !== undefined) {
        attendanceByDay[key]++
      }
    }

    return response.ok({
      resumen: {
        nivel_actual: nivelActual,
        porcentaje_asistencia: porcentajeAsistencia,
        clases_hoy: clasesHoy.length,
      },
      graficos: {
        asistencia_por_dia: attendanceByDay,
      },
      clases_hoy: clasesHoy,
    })
  }
}
