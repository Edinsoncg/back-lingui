import { HttpContext } from '@adonisjs/core/http'
import StudentAttendance from '#models/student_attendance'
import ClassroomSession from '#models/classroom_session'
import Student from '#models/student'

export default class StudentAttendanceController {
  // Obtener los estudiantes inscritos en una clase
  public async getStudentsInClass({ params, request, response }: HttpContext) {
    const { classroom_session_id } = params
    const page = request.input('page', 1)  // Página solicitada
    const limit = request.input('limit', 10)  // Límite de resultados por página
    const studentCode = request.input('student_code')  // Filtro por código de estudiante

    // Buscar la clase
    const classroomSession = await ClassroomSession.findOrFail(classroom_session_id)

    // Preparar la consulta de los estudiantes inscritos en la clase
    const query = classroomSession
      .related('attendances')
      .query()
      .preload('student_contract', (query) => {
        query.preload('student', (studentQuery) => {
          studentQuery.preload('user') // Preload de la relación 'user' del estudiante
        })
      })

    // Filtro por código de estudiante (opcional)
    if (studentCode) {
      query.whereHas('student_contract', (contractQuery) => {
        contractQuery.whereHas('student', (studentQuery) => {
          studentQuery.where('student_code', 'like', `%${studentCode}%`)  // Filtro de código
        })
      })
    }

    // Ordenamiento por fecha de creación
    query.orderBy('created_at', 'desc')

    // Paginación
    const paginator = await query.paginate(page, limit)

    // Responder con los datos paginados y el total
    return response.ok({
      data: paginator.all(),
      total: paginator.getMeta().total,
    })
  }

  // Agregar un estudiante a la clase
  public async addStudentToClass({ params, request, response }: HttpContext) {
    const { classroom_session_id } = params  // El ID de la clase desde la URL
    const studentCode = request.input('student_code')  // El código del estudiante que se quiere agregar
    // Buscar la clase en la base de datos
    const classroomSession = await ClassroomSession.findOrFail(classroom_session_id)
    // Verificar si el estudiante ya está inscrito en la clase
    const attendanceExists = await StudentAttendance.query()
      .where('classroom_session_id', classroom_session_id)
      .whereHas('student_contract', (query) => {
        query.whereHas('student', (studentQuery) => studentQuery.where('student_code', studentCode))
      })
      .first()
    if (attendanceExists) {
      return response.badRequest({ message: 'El estudiante ya está inscrito en esta clase.' })
    }
    // Buscar al estudiante por su código
    const student = await Student.query().where('student_code', studentCode).first()
    if (!student) {
      return response.notFound({ message: 'Estudiante no encontrado.' })
    }
    // Obtener el contrato activo del estudiante
    const studentContract = await student
      .related('contracts')
      .query()
      .where('end_date', '>', new Date())  // Validar que el contrato esté activo
      .first()
    if (!studentContract) {
      return response.badRequest({ message: 'El estudiante no tiene un contrato activo.' })
    }
    // Crear la relación de asistencia entre el estudiante y la clase
    const studentAttendance = await StudentAttendance.create({
      student_contract_id: studentContract.id,
      classroom_session_id: classroomSession.id,
    })
    return response.created(studentAttendance)
  }

  // Eliminar un estudiante de la clase
  public async removeStudentFromClass({ params, response }: HttpContext) {
    const { classroom_session_id, student_id } = params

    // Buscar la asistencia del estudiante en la clase
    const attendance = await StudentAttendance.query()
      .where('classroom_session_id', classroom_session_id)
      .whereHas('student_contract', (query) => query.where('student_id', student_id))
      .first()

    if (!attendance) {
      return response.notFound({ message: 'El estudiante no está inscrito en esta clase.' })
    }

    // Eliminar la asistencia
    await attendance.delete()

    return response.ok({ message: 'Estudiante eliminado de la clase.' })
  }
}
