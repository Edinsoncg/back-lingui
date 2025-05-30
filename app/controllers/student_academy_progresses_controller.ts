import UnitComponent from '#models/unit_component'
import StudentProgress from '#models/student_progress'
import Student from '#models/student'
import Unit from '#models/unit'
import Level from '#models/level'
import StudentUnit from '#models/student_unit'
import StudentLevel from '#models/student_level'
import type { HttpContext } from '@adonisjs/core/http'

export default class StudentAcademyProgressesController {
  async list({ request, response }: HttpContext) {
    const studentCode = request.input('student_code')

    if (!studentCode) {
      return response.ok({ student: null, current: null, progress: [] })
    }

    const student = await Student.query().where('student_code', studentCode).preload('user').first()
    if (!student) return response.notFound({ message: 'Studiante no encontrado' })

    // Obtener nivel actual desde student_levels
    const currentLevelRecord = await StudentLevel.query()
      .where('student_id', student.id)
      .where('is_current', true)
      .preload('level')
      .first()

    if (!currentLevelRecord) return response.ok({ student: student.student_code, current: null, progress: [] })

    // Obtener unidad actual desde student_units
    const currentUnitRecord = await StudentUnit.query()
      .where('student_id', student.id)
      .where('is_current', true)
      .preload('unit')
      .first()

    if (!currentUnitRecord) return response.ok({ student: student.student_code, current: null, progress: [] })

    // Obtener componentes de la unidad actual con preload
    const unitComponents = await UnitComponent.query()
      .where('unit_id', currentUnitRecord.unit_id)
      .preload('component')

    // Obtener componentes completados por el estudiante
    const completedProgress = await StudentProgress.query()
      .where('student_id', student.id)

    const completedComponentIds = completedProgress.map((progress) => progress.unit_component_id)

    const currentComponents = []
    for (const unitComponent of unitComponents) {
      currentComponents.push({
        id: unitComponent.id,
        component: unitComponent.component.name,
        completed: completedComponentIds.includes(unitComponent.id),
        student_id: student.id,
      })
    }

    const progress = []
    for (const item of completedProgress) {
      const unitComponent = await UnitComponent.query()
        .where('id', item.unit_component_id)
        .preload('unit', (query) => query.preload('level'))
        .preload('component')
        .first()

      if (unitComponent) {
        progress.push({
          unit_component_id: unitComponent.id,
          unit: unitComponent.unit.name,
          component: unitComponent.component.name,
        })
      }
    }

    // Calcular progreso de unidades en el nivel actual
    const allUnitsInLevel = await Unit.query()
      .where('level_id', currentLevelRecord.level_id)
      .orderBy('sequence_order', 'asc')

    const unitIndex = allUnitsInLevel.findIndex(
      (unit) => unit.id === currentUnitRecord.unit_id
    )

    const progressPercentage = allUnitsInLevel.length
      ? Math.round(((unitIndex + 1) / allUnitsInLevel.length) * 100)
      : 0

    return response.ok({
      student: {
        code: student.student_code,
        name: `${student.user?.first_name ?? ''} ${student.user?.first_last_name ?? ''}`,
      },
      current: {
        level: currentLevelRecord.level.name,
        unit: currentUnitRecord.unit.name,
        components: currentComponents,
        progressPercentage
      },
      progress,
    })
  }

  /**
   * Marca un componente como completado
   */
  async complete({ request, response }: HttpContext) {
    const { student_id, unit_component_id } = request.only(['student_id', 'unit_component_id'])

    if (!student_id || !unit_component_id) {
      return response.badRequest({ message: 'student_id y unit_component_id son requeridos' })
    }

    const exists = await StudentProgress.query()
      .where('student_id', student_id)
      .andWhere('unit_component_id', unit_component_id)
      .first()

    if (exists) {
      return response.ok({ message: 'Completado exitosamente' })
    }

    await StudentProgress.create({ student_id, unit_component_id })
    return response.created({ message: 'Componente completado exitosamente ' })
  }

  /**
   * Desmarca un componente
   */
  async uncomplete({ request, response }: HttpContext) {
    const student_id = request.input('student_id')
    const unit_component_id = request.input('unit_component_id')

    if (!student_id || !unit_component_id) {
      return response.badRequest({ message: 'student_id y unit_component_id son requeridos' })
    }

    const progress = await StudentProgress.query()
      .where('student_id', student_id)
      .andWhere('unit_component_id', unit_component_id)
      .first()

    if (!progress) {
      return response.notFound({ message: 'Progreso no encontrado' })
    }

    await progress.delete()
    return response.ok({ message: 'Componente no completado' })
  }

   async saveProgress({ request, response }: HttpContext) {
    const { student_id, changes } = request.only(['student_id', 'changes'])

    if (!student_id || !Array.isArray(changes)) {
      return response.badRequest({ message: 'student_id y cambios validos son requeridos' })
    }

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

    const firstCompleted = changes.find((c) => c.completed)
    if (!firstCompleted) {
      return response.ok({ message: 'Progreso actualizado sin avance de unidad' })
    }

    const currentUnitComponent = await UnitComponent.query()
      .where('id', firstCompleted.unit_component_id)
      .preload('unit', (query) => query.preload('level'))
      .first()

    if (!currentUnitComponent) {
      return response.ok({ message: 'Unidad actual no encontrada' })
    }

    const currentUnit = currentUnitComponent.unit
    const currentLevel = currentUnit.level

    const unitComponents = await UnitComponent.query().where('unit_id', currentUnit.id)

    const allCompleted = unitComponents.every((uc) =>
      changes.find((c) => c.unit_component_id === uc.id && c.completed)
    )

    if (!allCompleted) {
      return response.ok({ message: 'Progreso actualizado' })
    }

    // Marcar unidad actual como completada
    const studentUnit = await StudentUnit.query()
      .where('student_id', student_id)
      .andWhere('unit_id', currentUnit.id)
      .first()

    if (studentUnit) {
      studentUnit.is_current = false
      studentUnit.completed = true
      await studentUnit.save()
    }

    // Buscar siguiente unidad
    let nextUnit = await Unit.query()
      .where('level_id', currentUnit.level_id)
      .where('sequence_order', '>', currentUnit.sequence_order)
      .orderBy('sequence_order', 'asc')
      .first()

    let advancedLevel = false
    if (!nextUnit) {
      const nextLevel = await Level.query()
        .where('sequence_order', '>', currentLevel.sequence_order)
        .orderBy('sequence_order', 'asc')
        .first()

      if (nextLevel) {
        nextUnit = await Unit.query()
          .where('level_id', nextLevel.id)
          .orderBy('sequence_order', 'asc')
          .first()

        if (nextUnit) advancedLevel = true
      }
    }

    if (!nextUnit) {
      return response.ok({
        message: 'Progreso actualizado. Ya completó el último nivel y unidad.',
      })
    }

    // ✅ Insertar componentes de la siguiente unidad sin marcarlos como completados
    const nextUnitComponents = await UnitComponent.query().where('unit_id', nextUnit.id)
    for (const uc of nextUnitComponents) {
      await StudentProgress.query()
        .where('student_id', student_id)
        .andWhere('unit_component_id', uc.id)
        .delete() // ✅ Eliminar por si había registros erróneos por seeders
    }

    // ✅ Registrar nueva unidad como actual
    await StudentUnit.create({
      student_id,
      unit_id: nextUnit.id,
      is_current: true,
      completed: false,
    })

    // ✅ Si avanzó de nivel, registrar también el nuevo nivel como actual
    if (advancedLevel) {
      const currentLevel = await StudentLevel.query()
        .where('student_id', student_id)
        .andWhere('is_current', true)
        .first()

      if (currentLevel) {
        currentLevel.is_current = false
        currentLevel.completed = true
        await currentLevel.save()
      }

      await StudentLevel.create({
        student_id,
        level_id: nextUnit.level_id,
        is_current: true,
        completed: false,
      })
    }

    return response.ok({
      message: 'Progreso guardado y unidad siguiente desbloqueada',
    })
  }
}
