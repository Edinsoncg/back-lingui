import type { HttpContext } from '@adonisjs/core/http'
import Student from '#models/student'
import StudentContract from '#models/student_contract'
import StudentUnit from '#models/student_unit'
import { studentExtendedValidator } from '#validators/student_extended'
import Contract from '#models/contract'
import StudentLevel from '#models/student_level'
import Unit from '#models/unit'
import StudentLanguage from '#models/student_language'

export default class StudentExtendedController {
  // Obtener info extendida del estudiante
  public async show({ params, response }: HttpContext) {
    const userId = params.id

    const student = await Student.query()
      .where('user_id', userId)
      .preload('status')
      .preload('languages')
      .first()

    if (!student) return response.notFound({ message: 'Estudiante no encontrado' })

    const unit = await StudentUnit.query()
      .where('student_id', student.id)
      .where('is_current', true)
      .preload('unit', (query) => query.preload('level'))
      .first()

    const contract = await StudentContract.query()
      .where('student_id', student.id)
      .andWhere('is_current', true)
      .preload('contract')
      .first()

    const language = student.languages[0]

    return {
      student_code: student.student_code,
      status: {
        id: student.status_id,
        name: student.status?.name,
      },
      language: {
        id: language?.id,
        name: language?.name,
      },
      level: {
        id: unit?.unit?.level_id,
        name: unit?.unit?.level?.name,
      },
      unit: {
        id: unit?.unit_id,
        name: unit?.unit?.name,
      },
      contract: {
        id: contract?.contract_id,
        name: contract?.contract?.name,
      },
      start_date: contract?.start_date ? new Date(contract.start_date).toISOString().split('T')[0] : null,
    }
  }

  // Crear o actualizar información extendida
  public async update({ request, params, response }: HttpContext) {
    const userId = params.id

    const {
      student_code,
      status_id,
      unit_id,
      contract_id,
      start_date,
      language_id,
    } = await request.validateUsing(studentExtendedValidator)

    // 1. Obtener o crear estudiante
    let student = await Student.findBy('user_id', userId)
    if (!student) {
      student = await Student.create({
        user_id: userId,
        student_code,
        status_id,
      })
    } else {
      student.student_code = student_code
      student.status_id = status_id
      await student.save()
    }

    // Actualizar idioma
    await StudentLanguage.query().where('student_id', student.id).delete()
    await StudentLanguage.create({
      student_id: student.id,
      language_id,
    })

    // 2. Obtener el level_id desde la unidad
    const unit = await Unit.findOrFail(unit_id)
    const level_id = unit.level_id

    // 3. Actualizar nivel actual
    await StudentLevel.query().where('student_id', student.id).update({ is_current: false })
    await StudentLevel.create({
      student_id: student.id,
      level_id,
      is_current: true,
      completed: false,
    })

    // 4. Registrar unidad actual en StudentUnit (desactivar anteriores)
    await StudentUnit.query().where('student_id', student.id).update({ is_current: false })
    await StudentUnit.create({
      student_id: student.id,
      unit_id,
      is_current: true,
      completed: false,
    })

    // 5. Crear contrato (con cálculo de end_date)
    const contractModel = await Contract.findOrFail(contract_id)
    const monthsToAdd = contractModel.month_amount
    const startDateObj = new Date(start_date)
    const endDate = new Date(startDateObj)
    endDate.setMonth(endDate.getMonth() + monthsToAdd)

    // 6. Registrar nuevo contrato y marcar como actual (desactivar anteriores)
    await StudentContract.query().where('student_id', student.id).update({ is_current: false })

    await StudentContract.create({
      student_id: student.id,
      contract_id,
      start_date: startDateObj,
      end_date: endDate,
      is_current: true,
    })

    return response.ok({ message: 'Student data saved correctly' })
  }
}
