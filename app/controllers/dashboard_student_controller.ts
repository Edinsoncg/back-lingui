import type { HttpContext } from '@adonisjs/core/http'
import Student from '#models/student'
import StudentAttendance from '#models/student_attendance'
import ClassroomSession from '#models/classroom_session'

function formatToLocalHour(date: Date): string {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return local.toISOString().substring(11, 16) // "HH:mm"
}

export default class DashboardStudentController {
  public async index({ auth, response }: HttpContext) {
    const user = auth.user!
    const today = new Date()

    // Obtener estudiante y su contrato activo
    const student = await Student.query()
      .where('user_id', user.id)
      .preload('contracts', (q) => q.orderBy('created_at', 'desc'))
      .preload('studentLevels', (q) => q.where('is_current', true).preload('level'))
      .firstOrFail()

    const activeContract = student.contracts.find((c) => {
      const now = new Date()
      return new Date(c.start_date.toString()) <= now && new Date(c.end_date.toString()) >= now
    })

    // 🟣 Clases programadas para hoy
    const startOfToday = new Date(today)
    startOfToday.setHours(0, 0, 0, 0)
    const endOfToday = new Date(today)
    endOfToday.setHours(23, 59, 59, 999)

    let clasesHoy: {
      id: number
      hour: string
      classroom: string | undefined
      level: string | undefined
    }[] = []

    if (activeContract) {
      const clasesProgramadasHoy = await ClassroomSession.query()
        .whereBetween('start_at', [startOfToday.toISOString(), endOfToday.toISOString()])
        .whereHas('attendances', (q) => {
          q.where('student_contract_id', activeContract.id)
        })
        .preload('classroom')
        .preload('unit', (q) => q.preload('level'))

      clasesHoy = clasesProgramadasHoy.map((clase) => ({
        id: clase.id,
        hour: formatToLocalHour(clase.start_at),
        classroom: clase.classroom?.name,
        level: clase.unit?.level?.name,
      }))
    }

    // 📆 Clases programadas este mes
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999)

    let clasesDelMes = 0

    if (activeContract) {
      const resultado = await ClassroomSession.query()
        .whereBetween('start_at', [startOfMonth.toISOString(), endOfMonth.toISOString()])
        .whereHas('attendances', (q) => {
          q.where('student_contract_id', activeContract.id)
        })
        .count('* as total')

      clasesDelMes = Number(resultado[0].$extras.total || 0)
    }

    // 🧠 Nivel actual
    const nivelActual = student.studentLevels[0]?.level?.name || null

    // 📊 Gráfico de asistencia (últimos 7 días)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(today.getDate() - 6)
    sevenDaysAgo.setHours(0, 0, 0, 0)

    const recientes = await StudentAttendance.query()
      .where('student_contract_id', activeContract?.id || 0)
      .preload('classroomSession')
      .whereHas('classroomSession', (q) => {
        q.where('start_at', '>=', sevenDaysAgo.toISOString())
      })

    const attendanceByDay: Record<string, number> = {}
    for (let i = 0; i < 7; i++) {
      const date = new Date(sevenDaysAgo)
      date.setDate(date.getDate() + i)
      const key = date.toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric' })
      attendanceByDay[key] = 0
    }

    for (const attendance of recientes) {
      const sessionDate = new Date(attendance.classroomSession!.start_at.toString())
      const key = sessionDate.toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric' })
      if (attendanceByDay[key] !== undefined) {
        attendanceByDay[key]++
      }
    }

    return response.ok({
      resumen: {
        nivel_actual: nivelActual,
        clases_hoy: clasesHoy.length,
        clases_mes: clasesDelMes,
      },
      graficos: {
        asistencia_por_dia: attendanceByDay,
      },
      clases_hoy: clasesHoy,
    })
  }
}
