import { HttpContext } from '@adonisjs/core/http'
import Student from '#models/student'
import StudentAttendance from '#models/student_attendance'
import ClassroomSession from '#models/classroom_session'
import TeacherUserLanguage from '#models/teacher_user_language'
import User from '#models/user'

export default class DashboardDynamicController {
  public async index({ auth, response }: HttpContext) {
    const user = auth.user!

    // Cargar el rol del usuario
    await user.load('userRoles', (query) => query.preload('role')) // Cargar el rol usando la relación con UserRole
    const role = user.userRoles[0]?.role?.name.toLowerCase() // Obtener el nombre del rol

    if (!role) {
      return response.status(400).json({ message: 'User role not assigned' })
    }

    let data = {}

    // Obtener los datos para cada rol
    if (role === 'administracion') {
      data = await this.getAdminData()
    } else if (role === 'recepcionista') {
      data = await this.getReceptionData()
    } else if (role === 'profesor') {
      data = await this.getTeacherData(user)
    } else if (role === 'estudiante') {
      data = await this.getStudentData(user)
    } else {
      return response.status(400).json({ message: 'Role not found' })
    }

    return response.ok({ data })
  }

  // Métodos para cargar datos según el rol
  private async getAdminData() {
    const totalStudents = await Student.query().count('* as total').first()
    const totalTeachers = await TeacherUserLanguage.query().count('* as total').first()
    const todayClasses = await ClassroomSession.query()
      .whereRaw('DATE(start_at) = ?', [new Date().toISOString().split('T')[0]])
      .count('* as total')
      .first()

    return {
      resumen: {
        total_students: totalStudents?.$extras.total || 0,
        total_teachers: totalTeachers?.$extras.total || 0,
        today_classes: todayClasses?.$extras.total || 0,
      },
      graficos: {
        asistencia_por_dia: {},
        estudiantes_por_nivel: {},
      },
      clases_hoy: [],
    }
  }

  private async getReceptionData() {
    const totalClassesToday = await ClassroomSession.query()
      .whereRaw('DATE(start_at) = ?', [new Date().toISOString().split('T')[0]])
      .count('* as total')
      .first()

    const todaySessions = await ClassroomSession.query()
      .whereRaw('DATE(start_at) = ?', [new Date().toISOString().split('T')[0]])
      .preload('classroom')

    return {
      resumen: {
        today_classes: totalClassesToday?.$extras.total || 0,
      },
      graficos: {
        asistencia_por_dia: {},
        estudiantes_por_nivel: {},
      },
      clases_hoy: todaySessions.map(session => ({
        hour: session.start_at.toISOString().substring(11, 16),
        classroom: session.classroom.name,
      })),
    }
  }

  private async getTeacherData(user) {
    const teacherId = user.teacherProfile?.id
    const today = new Date()
    const startOfToday = new Date(today)
    startOfToday.setHours(0, 0, 0, 0)

    const endOfToday = new Date(today)
    endOfToday.setHours(23, 59, 59, 999)

    // Clases programadas para hoy
    const todaySessions = await ClassroomSession.query()
      .where('teacher_user_language_id', teacherId!)
      .whereBetween('start_at', [startOfToday, endOfToday])
      .preload('classroom')
      .preload('unit', (q) => q.preload('level'))

    const todayClasses = todaySessions.map((session) => ({
      hour: session.start_at.toISOString().substring(11, 16),
      classroom: session.classroom.name,
      level: session.unit.level.name,
    }))

    // Gráfico de asistencia por día (últimos 7 días)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(today.getDate() - 6)
    sevenDaysAgo.setHours(0, 0, 0, 0)

    const sessions = await ClassroomSession.query()
      .where('teacher_user_language_id', teacherId)
      .select('id')

    const sessionIds = sessions.map(s => s.id)

    const recentAttendances = await StudentAttendance.query()
      .whereIn('classroom_session_id', sessionIds)
      .where('created_at', '>=', sevenDaysAgo.toISOString())

    const attendanceByDay: Record<string, number> = {}

    for (let i = 0; i < 7; i++) {
      const date = new Date(sevenDaysAgo)
      date.setDate(date.getDate() + i)
      const key = date.toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric' })
      attendanceByDay[key] = 0
    }

    for (const attendance of recentAttendances) {
      const date = new Date(attendance.createdAt.toString())
      const key = date.toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric' })
      if (attendanceByDay[key] !== undefined) {
        attendanceByDay[key]++
      }
    }

    return {
      resumen: {
        today_classes: todayClasses.length,
      },
      graficos: {
        asistencia_por_dia: attendanceByDay,
        estudiantes_por_nivel: {},
      },
      clases_hoy: todayClasses,
    }
  }

  private async getStudentData(user) {
    const student = await Student.query()
      .where('user_id', user.id)
      .preload('contracts')
      .preload('studentLevels', (q) => q.where('is_current', true).preload('level'))
      .firstOrFail()

    const activeContract = student.contracts.find((contract) => {
      const now = new Date()
      return new Date(contract.start_date.toString()) <= now && new Date(contract.end_date.toString()) >= now
    })

    // Clases hoy
    let clasesHoy = []
    if (activeContract) {
      const studentAttendance = await StudentAttendance.query()
        .where('student_contract_id', activeContract.id)
        .preload('classroomSession', (q) =>
          q.preload('classroom').preload('unit', (innerQ) => innerQ.preload('level'))
        )

      clasesHoy = studentAttendance.map((attendance) => ({
        hour: attendance.classroomSession?.start_at.toISOString().substring(11, 16),
        classroom: attendance.classroomSession?.classroom?.name,
        level: attendance.classroomSession?.unit?.level?.name,
      }))
    }

    // Asistencia por día (últimos 7 días)
    const today = new Date()
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(today.getDate() - 6)
    sevenDaysAgo.setHours(0, 0, 0, 0)

    const recientes = await StudentAttendance.query()
      .where('student_contract_id', activeContract?.id || 0)
      .where('created_at', '>=', sevenDaysAgo.toISOString())

    const attendanceByDay: Record<string, number> = {}

    // Inicializamos los días de la semana
    for (let i = 0; i < 7; i++) {
      const date = new Date(sevenDaysAgo)
      date.setDate(date.getDate() + i)
      const key = date.toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric' })
      attendanceByDay[key] = 0
    }

    // Contamos las asistencias por día
    for (const attendance of recientes) {
      const date = new Date(attendance.createdAt.toString())
      const key = date.toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric' })
      if (attendanceByDay[key] !== undefined) {
        attendanceByDay[key]++
      }
    }

    const levelCurrent = student.studentLevels[0]?.level?.name

    return {
      resumen: {
        nivel_actual: levelCurrent,
        porcentaje_asistencia: 100,  // Este valor se puede calcular dinámicamente si es necesario
        clases_hoy: clasesHoy.length,
      },
      graficos: {
        asistencia_por_dia: attendanceByDay,
      },
      clases_hoy: clasesHoy,
    }
  }
}
