// app/controllers/dashboard_teacher_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import ClassroomSession from '#models/classroom_session'
import StudentAttendance from '#models/student_attendance'

export default class DashboardTeacherController {
  public async index({ auth, response }: HttpContext) {
    const user = auth.user!
    await auth.user?.load('teacherProfile')
    const teacherId = auth.user?.teacherProfile?.id

    const today = new Date()
    const startOfToday = new Date(today)
    startOfToday.setHours(0, 0, 0, 0)

    const endOfToday = new Date(today)
    endOfToday.setHours(23, 59, 59, 999)

    // 📋 Clases programadas para hoy
    const todaySessions = await ClassroomSession.query()
      .where('teacher_user_language_id', teacherId!)
      .whereBetween('start_at', [startOfToday, endOfToday])
      .preload('classroom')
      .preload('unit', (q) => q.preload('level'))

    const todayClasses = todaySessions.map((session) => ({
      id: session.id,
      hour: session.start_at.toISOString().substring(11, 16),
      classroom: session.classroom?.name,
      level: session.unit?.level?.name,
    }))

    // 📅 Total de clases del mes
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999)

    const monthlyClassCount = await ClassroomSession.query()
      .where('teacher_user_language_id', teacherId!)
      .whereBetween('start_at', [startOfMonth, endOfMonth])
      .count('* as total')
      .first()

    // 📊 Gráfico de asistencias por día (últimos 7 días)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(today.getDate() - 6)
    sevenDaysAgo.setHours(0, 0, 0, 0)

    const sessions = await ClassroomSession.query()
      .where('teacher_user_language_id', teacherId)
      .select('id')

    const sessionIds = sessions.map((s) => s.id)

    const recentAttendances = await StudentAttendance.query()
      .whereIn('classroom_session_id', sessionIds)
      .where('created_at', '>=', sevenDaysAgo.toISOString())

    const attendanceByDay: Record<string, number> = {}
    let totalAttendance = 0

    for (let i = 0; i < 7; i++) {
      const date = new Date(sevenDaysAgo)
      date.setDate(date.getDate() + i)
      const key = date.toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric' })
      attendanceByDay[key] = 0
    }

    for (const attendance of recentAttendances) {
      const created = new Date(attendance.createdAt.toString())
      const key = created.toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric' })
      if (attendanceByDay[key] !== undefined) {
        attendanceByDay[key]++
        totalAttendance++
      }
    }

    const avgWeeklyAttendance = +(totalAttendance / 7).toFixed(1)

    return response.ok({
      resumen: {
        today_classes: todayClasses.length,
        total_classes_month: Number(monthlyClassCount?.$extras.total || 0),
        avg_weekly_attendance: Math.round(avgWeeklyAttendance * 100),
      },
      graficos: {
        asistencia_por_dia: attendanceByDay,
      },
      clases_hoy: todayClasses,
    })
  }
}
