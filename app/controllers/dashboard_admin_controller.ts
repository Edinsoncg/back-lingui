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
    const todayISO = now.toISOString().split('T')[0] // yyyy-mm-dd

    // --- Totales ---
    const totalStudents = await Student.query().where('status_id', 1)
    const totalTeachers = await TeacherUserLanguage.query()
    const totalContracts = await StudentContract.query()
    const todayClasses = await ClassroomSession.query().whereRaw('DATE(start_at) = ?', [todayISO])

    // --- Gráfico: asistencia mensual ---
    const attendance_by_month: Record<string, number> = {}

    // Generar los últimos 4 meses (incluyendo el actual)
    for (let i = 3; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = date.toLocaleString('default', { month: 'short' }) // ej. "Mar"
      attendance_by_month[key] = 0
    }

    // Obtener solo asistencias de esos últimos 4 meses
    const fourMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1)
    const recentAttendances = await StudentAttendance.query()
      .where('created_at', '>=', fourMonthsAgo.toISOString())

    // Contar asistencias por mes
    for (const attendance of recentAttendances) {
      const date = new Date(attendance.createdAt.toISO())
      const monthKey = date.toLocaleString('default', { month: 'short' })
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

    return response.ok({
      resumen: {
        total_students: totalStudents.length,
        total_teachers: totalTeachers.length,
        total_contracts: totalContracts.length,
        today_classes: todayClasses.length,
      },
      graficos: {
        attendance_by_month: attendance_by_month,
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
