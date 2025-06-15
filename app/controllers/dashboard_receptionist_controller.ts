// app/controllers/dashboard_receptionist_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import Student from '#models/student'
import TeacherUserLanguage from '#models/teacher_user_language'
import StudentAttendance from '#models/student_attendance'
import StudentLevel from '#models/student_level'
import ClassroomSession from '#models/classroom_session'

export default class DashboardReceptionistController {
  public async index({ response }: HttpContext) {
    const [totalStudents, totalTeachers] = await Promise.all([
      Student.query().count('* as total').first(),
      TeacherUserLanguage.query().count('* as total').first(),
    ])

    // Fecha actual (inicio y fin del día)
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date()
    endOfDay.setHours(23, 59, 59, 999)

    const todayClassesCount = await ClassroomSession.query()
      .where('start_at', '>=', startOfDay)
      .andWhere('start_at', '<=', endOfDay)
      .count('* as total')
      .first()

    // Asistencias por mes (últimos 4 meses incluyendo el actual)
    const fourMonthsAgo = new Date()
    fourMonthsAgo.setMonth(fourMonthsAgo.getMonth() - 3)

    const recentAttendances = await StudentAttendance.query()
      .whereHas('classroomSession', (query) => {
        query.where('start_at', '>=', fourMonthsAgo.toISOString())
      })
      .preload('classroomSession')


    const attendanceByMonth: Record<string, number> = {
      Ene: 0, Feb: 0, Mar: 0, Abr: 0, May: 0, Jun: 0,
      Jul: 0, Ago: 0, Sep: 0, Oct: 0, Nov: 0, Dic: 0,
    }

    for (const attendance of recentAttendances) {
      const sessionDate = new Date(attendance.classroomSession?.start_at || '')
      const month = sessionDate.toLocaleString('es-CO', { month: 'short' })
      const key = month.charAt(0).toUpperCase() + month.slice(1, 3).toLowerCase()
      if (attendanceByMonth[key] !== undefined) {
        attendanceByMonth[key]++
      }
    }

    const currentMonth = new Date().getMonth()
    const recentMonths = []
    for (let i = 3; i >= 0; i--) {
      const monthDate = new Date()
      monthDate.setMonth(currentMonth - i)
      const monthName = monthDate.toLocaleString('es-CO', { month: 'short' })
      const formatted = monthName.charAt(0).toUpperCase() + monthName.slice(1, 3).toLowerCase()
      recentMonths.push(formatted)
    }

    const orderedAttendance: Record<string, number> = {}
    for (const month of recentMonths) {
      orderedAttendance[month] = attendanceByMonth[month] || 0
    }

    // Estudiantes por nivel
    const students = await Student.query().preload('studentLevels', (q) =>
      q.where('is_current', true).preload('level')
    )

    const studentsByLevel: Record<string, number> = {}
    for (const student of students) {
      for (const sl of student.studentLevels) {
        const levelName = sl.level?.name
        if (levelName) {
          studentsByLevel[levelName] = (studentsByLevel[levelName] || 0) + 1
        }
      }
    }

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
        total_students: totalStudents?.$extras.total || 0,
        total_teachers: totalTeachers?.$extras.total || 0,
        today_classes: todayClassesCount?.$extras.total || 0,
      },
      graficos: {
        attendance_by_month: orderedAttendance,
        students_by_level: studentsByLevel,
      },
      clases_hoy: todayClassesList,
    })
  }
}
