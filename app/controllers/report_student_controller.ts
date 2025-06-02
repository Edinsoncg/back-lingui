import type { HttpContext } from '@adonisjs/core/http'
import Student from '#models/student'
import ClassroomSession from '#models/classroom_session'

export default class ReportStudentController {
  public async index({ request, response }: HttpContext) {
    const page = Number(request.input('page', 1))
    const limit = Number(request.input('limit', 10))
    const code = request.input('code')?.trim()
    const name = request.input('name')?.trim()

    const query = Student.query()
      .preload('user')
      .preload('contracts', (contractQuery) => {
        contractQuery.preload('contract').orderBy('created_at', 'desc')
      })
      .preload('studentLanguages', (langQuery) => {
        langQuery.preload('language')
      })
    if (code || name) {
      query.where((subQuery) => {
        if (code) {
          subQuery.orWhereILike('student_code', `%${code}%`)
        }

        subQuery.orWhereHas('user', (userQuery) => {
          userQuery.whereILike('first_name', `%${name}%`)
            .orWhereILike('middle_name', `%${name}%`)
            .orWhereILike('first_last_name', `%${name}%`)
            .orWhereILike('second_last_name', `%${name}%`)
        })
      })
    }

    const result = await query.paginate(page, limit)
    const formatted = await Promise.all(
      result.all().map(async (student) => {
        const user = student.user
        const contractActivo = student.contracts?.[0]
        const tipoContrato = contractActivo?.contract?.name || 'No asignado'

        // Buscar la clase más reciente para unidad y nivel
        const ultimaClase = await ClassroomSession.query()
          .whereHas('attendances', (att) => {
            att.whereHas('student_contract', (contract) => {
              contract.where('student_id', student.id)
            })
          })
          .orderBy('start_at', 'desc')
          .preload('unit')
          .preload('level')
          .first()

        const unidad = ultimaClase?.unit?.name || 'N/A'
        const nivel = ultimaClase?.level?.name || 'N/A'

        const idioma = student.studentLanguages?.[0]?.language?.name || 'N/A'

        return {
          codigo: student.student_code,
          nombre: [user.first_name, user.middle_name].filter(Boolean).join(' '),
          apellido: [user.first_last_name, user.second_last_name].filter(Boolean).join(' '),
          nivel,
          unidad,
          idioma,
          estado: student.status_id === 1 ? 'Activo' : 'Inactivo',
          tipo_contrato: tipoContrato,
        }
      })
    )

    return response.ok({
      data: formatted,
      total: result.getMeta().total,
    })
  }

  public async show({ params, response }: HttpContext) {
    const studentCode = params.code

    if (!studentCode) {
      return response.badRequest({ message: 'El código del estudiante es requerido' })
    }

    const student = await Student.query()
      .where('student_code', studentCode)
      .preload('user')
      .preload('status')
      .preload('studentLanguages', (query) => query.preload('language'))
      .preload('contracts', (query) =>
        query
          .preload('contract')
          .preload('attendances', (att) =>
            att.preload('classroomSession', (session) => {
              session
                .preload('level')
                .preload('unit')
                .preload('modality') // si la relación existe
            })
          )
          .orderBy('created_at', 'desc')
      )
      .first()

    if (!student) {
      return response.notFound({ message: 'Estudiante no encontrado' })
    }

    // Obtener contrato activo
    const contratoActivo = student.contracts[0]
    const contrato = contratoActivo?.contract

    const idioma = student.studentLanguages[0]?.language?.name || 'N/A'
    const nombre = [student.user.first_name, student.user.middle_name].filter(Boolean).join(' ')
    const apellido = [student.user.first_last_name, student.user.second_last_name].filter(Boolean).join(' ')

    const clases = contratoActivo?.attendances.map((asistencia) => {
    const clase = asistencia.classroomSession
    return {
      id: clase.id,
      fecha: new Date(clase.start_at).toISOString().split('T')[0],
      nivel: clase.level?.name || 'N/A',
      unidad: clase.unit?.name || 'N/A',
      modalidad: clase.modality?.kind || 'N/A',
      duracion: clase.duration,
      asistio: true,
    }}) || []

    return response.ok({
      estudiante: {
        codigo: student.student_code,
        nombre,
        apellido,
        estado: student.status?.name || 'N/A',
        idioma,
        tipo_contrato: contrato?.name || 'No asignado',
        fecha_inicio: contratoActivo?.start_date
          ? new Date(contratoActivo.start_date).toISOString().split('T')[0]
          : 'N/A',
        fecha_fin: contratoActivo?.end_date
          ? new Date(contratoActivo.end_date).toISOString().split('T')[0]
          : 'N/A',

      },
      clases,
    })
  }


}
