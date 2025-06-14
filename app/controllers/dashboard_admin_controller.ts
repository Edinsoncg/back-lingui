// start of AdminDashboardController.ts
import Student from '#models/student'
import TeacherUserLanguage from '#models/teacher_user_language'
import StudentContract from '#models/student_contract'
import StudentAttendance from '#models/student_attendance'
import StudentLevel from '#models/student_level'
import ClassroomSession from '#models/classroom_session'
import type { HttpContext } from '@adonisjs/core/http'

export default class AdminDashboardController {
  async index({ response }: HttpContext) {
    const now = new Date()

    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date()
    endOfDay.setHours(23, 59, 59, 999)

    // --- Totales ---
    const [totalStudents, totalTeachers, totalContracts] = await Promise.all([
      Student.query().where('status_id', 1),
      TeacherUserLanguage.query(),
      StudentContract.query(),
    ])

    const todayClasses = await ClassroomSession.query()
      .where('start_at', '>=', startOfDay)
      .andWhere('start_at', '<=', endOfDay)

    // --- Gráfico: asistencia mensual ---
    const attendance_by_month: Record<string, number> = {}

    // Generar los últimos 4 meses (incluyendo el actual)
    for (let i = 3; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = date.toLocaleString('es-CO', { month: 'short' })
      attendance_by_month[key] = 0
    }

    // Obtener solo asistencias de esos últimos 4 meses
    const fourMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1)
    const recentAttendances = await StudentAttendance.query()
      .where('created_at', '>=', fourMonthsAgo.toISOString())

    // Contar asistencias por mes
    for (const attendance of recentAttendances) {
      const date = new Date(attendance.createdAt)
      const monthKey = date.toLocaleString('es-CO', { month: 'short' })
      if (attendance_by_month[monthKey] !== undefined) {
        attendance_by_month[monthKey]++
      }
    }

    // --- Gráfico: estudiantes por nivel ---
    const currentLevels = await StudentLevel.query().where('is_current', true).preload('level')

    const studentsByLevel: Record<string, number> = {}
    for (const record of currentLevels) {
      const name = record.level.name
      studentsByLevel[name] = (studentsByLevel[name] || 0) + 1
    }

    // --- Notificaciones: nuevos estudiantes ---
    const newStudents = await Student.query()
      .where('status_id', 1)
      .orderBy('created_at', 'desc')
      .limit(5)
      .preload('user')

    // --- Notificaciones: contratos por vencer ---
    const today = new Date()
    const next7days = new Date()
    next7days.setDate(today.getDate() + 7)

    const expiringContracts = await StudentContract.query()
      .where('end_date', '>=', today.toISOString())
      .andWhere('end_date', '<=', next7days.toISOString())
      .preload('contract')
      .preload('student', (q) => q.preload('user'))

    // Lista de clases programadas hoy
    const todaySessions = await ClassroomSession.query()
      .where('start_at', '>=', startOfDay)
      .andWhere('start_at', '<=', endOfDay)
      .preload('classroom')
      .preload('unit', (q) => q.preload('level'))
      .preload('teacher', (q) => q.preload('user').preload('language'))

    const todayClassesList = todaySessions.map((session) => {
      const startDate = new Date(session.start_at)
      const time = startDate.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
      return {
        time,
        classroom: session.classroom?.name,
        level: session.unit?.level?.name,
        teacher: `${session.teacher?.user?.first_name} ${session.teacher?.user?.first_last_name}`,
      }
    })

    return response.ok({
      resumen: {
        total_students: totalStudents.length,
        total_teachers: totalTeachers.length,
        total_contracts: totalContracts.length,
        today_classes: todayClasses.length,
        clases_hoy: todayClassesList,
      },
      graficos: {
        attendance_by_month,
        students_by_level: studentsByLevel,
      },
      notificaciones: {
        newStudents,
        expiring_contracts: expiringContracts,
      },
    })
  }
}
// end of AdminDashboardController.ts
