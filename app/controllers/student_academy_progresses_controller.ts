import UnitComponent from '#models/unit_component'
import StudentProgress from '#models/student_progress'
import Student from '#models/student'
import Unit from '#models/unit'
import Level from '#models/level'
import type { HttpContext } from '@adonisjs/core/http'

export default class StudentAcademyProgressesController {
  /**
   * Lista el progreso del estudiante por código y muestra componentes actuales
   */
  async list({ request, response }: HttpContext) {
    const studentCode = request.input('student_code')

    if (!studentCode) {
      return response.ok({
        student: null,
        current: null,
        progress: [],
      })
    }

    const student = await Student.query().where('student_code', studentCode).preload('user').first()

    if (!student) {
      return response.notFound({ message: 'Student not found' })
    }

    // Cargar progreso del estudiante
    const progressList = await StudentProgress.query()
      .where('student_id', student.id)
      .preload('unit_component', (query) => {
        query.preload('unit', (unitQuery) => unitQuery.preload('level')).preload('component')
      })

    const completedComponents = progressList.map((p) => p.unit_component_id)

    // Detectar unidad actual (mayor sequence_order)
    const last = progressList.reduce((acc, curr) => {
      const a = acc.unit_component.unit.sequence_order
      const b = curr.unit_component.unit.sequence_order
      return b > a ? curr : acc
    }, progressList[0])

    const currentUnit = last.unit_component.unit
    const currentLevel = currentUnit.level

    // Cargar todos los unit_components de la unidad actual
    const unitComponents = await UnitComponent.query()
      .where('unit_id', currentUnit.id)
      .preload('component')

    const currentComponents = unitComponents.map((uc) => ({
      id: uc.id,
      component: uc.component.name,
      completed: completedComponents.includes(uc.id),
      student_id: student.id,
    }))

    return response.ok({
      student: {
        code: student.student_code,
        name: `${student.user?.first_name ?? ''} ${student.user?.first_last_name ?? ''}`,
      },
      current: {
        level: currentLevel.name,
        unit: currentUnit.name,
        components: currentComponents,
      },
      progress: progressList.map((p) => ({
        unit_component_id: p.unit_component_id,
        unit: p.unit_component.unit.name,
        component: p.unit_component.component.name,
      })),
    })
  }

  /**
   * Marca un componente como completado
   */
  async complete({ request, response }: HttpContext) {
    const { student_id, unit_component_id } = request.only(['student_id', 'unit_component_id'])

    if (!student_id || !unit_component_id) {
      return response.badRequest({ message: 'student_id and unit_component_id are required' })
    }

    const exists = await StudentProgress.query()
      .where('student_id', student_id)
      .andWhere('unit_component_id', unit_component_id)
      .first()

    if (exists) {
      return response.ok({ message: 'Already completed' })
    }

    await StudentProgress.create({ student_id, unit_component_id })
    return response.created({ message: 'Component marked as completed' })
  }

  /**
   * Desmarca un componente
   */
  async uncomplete({ request, response }: HttpContext) {
    const student_id = request.input('student_id')
    const unit_component_id = request.input('unit_component_id')

    if (!student_id || !unit_component_id) {
      return response.badRequest({ message: 'student_id and unit_component_id are required' })
    }

    const progress = await StudentProgress.query()
      .where('student_id', student_id)
      .andWhere('unit_component_id', unit_component_id)
      .first()

    if (!progress) {
      return response.notFound({ message: 'Progress not found' })
    }

    await progress.delete()
    return response.ok({ message: 'Component unmarked' })
  }

  async saveProgress({ request, response }: HttpContext) {
    const { student_id, changes } = request.only(['student_id', 'changes'])

    if (!student_id || !Array.isArray(changes)) {
      return response.badRequest({ message: 'student_id and valid changes array are required' })
    }

    // 1. Guardar los cambios actuales
    for (const item of changes) {
      const { unit_component_id, completed } = item
      if (!unit_component_id) continue

      const existing = await StudentProgress.query()
        .where('student_id', student_id)
        .andWhere('unit_component_id', unit_component_id)
        .first()

      if (completed && !existing) {
        await StudentProgress.create({ student_id, unit_component_id })
      } else if (!completed && existing) {
        await existing.delete()
      }
    }

    // 2. Obtener la unidad actual basada en uno de los cambios completados
    const firstCompletedId = changes.find((c) => c.completed)?.unit_component_id
    if (!firstCompletedId) {
      return response.ok({ message: 'Progreso actualizado sin avance de unidad' })
    }

    const currentUnitComponent = await UnitComponent.query()
      .where('id', firstCompletedId)
      .preload('unit', (query) => query.preload('level'))
      .first()

    if (!currentUnitComponent) {
      return response.ok({ message: 'Unidad actual no encontrada' })
    }

    const currentUnit = currentUnitComponent.unit
    const unitComponents = await UnitComponent.query().where('unit_id', currentUnit.id)

    const allCompleted = unitComponents.every((uc) =>
      changes.find((c) => c.unit_component_id === uc.id && c.completed)
    )

    if (!allCompleted) {
      return response.ok({ message: 'Progreso actualizado' })
    }

    // 3. Buscar siguiente unidad en el mismo nivel
    let nextUnit = await Unit.query()
      .where('level_id', currentUnit.level_id)
      .where('sequence_order', '>', currentUnit.sequence_order)
      .orderBy('sequence_order', 'asc')
      .first()

    // 4. Si no hay más unidades → avanzar al siguiente nivel
    if (!nextUnit) {
      const nextLevel = await Level.query()
        .where('sequence_order', '>', currentUnit.level.sequence_order)
        .orderBy('sequence_order', 'asc')
        .first()

      if (nextLevel) {
        nextUnit = await Unit.query()
          .where('level_id', nextLevel.id)
          .orderBy('sequence_order', 'asc')
          .first()
      }
    }

    // 5. Si no hay más niveles o unidades, finaliza
    if (!nextUnit) {
      return response.ok({
        message: 'Progreso actualizado. Ya completó el último nivel y unidad.',
      })
    }

    // 6. Cargar e insertar componentes de la siguiente unidad
    const nextComponents = await UnitComponent.query().where('unit_id', nextUnit.id)

    for (const uc of nextComponents) {
      await StudentProgress.firstOrCreate({
        student_id,
        unit_component_id: uc.id,
      })
    }

    return response.ok({
      message: 'Progreso guardado y unidad siguiente desbloqueada',
    })
  }
}
