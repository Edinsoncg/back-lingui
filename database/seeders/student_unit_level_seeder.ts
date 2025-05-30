import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Student from '#models/student'
import StudentProgress from '#models/student_progress'
import UnitComponent from '#models/unit_component'
import Unit from '#models/unit'
import StudentLevel from '#models/student_level'
import StudentUnit from '#models/student_unit'

export default class StudentLevelAndUnitSeeders extends BaseSeeder {
  public async run() {
    const students = await Student.all()

    for (const student of students) {
      const lastProgress = await StudentProgress.query()
        .where('student_id', student.id)
        .orderBy('unit_component_id', 'desc')
        .first()

      if (!lastProgress) continue // Si no tiene progreso, lo saltamos

      const unitComponent = await UnitComponent.findOrFail(lastProgress.unit_component_id)
      const unit = await Unit.findOrFail(unitComponent.unit_id)

      // Asignar el nivel actual
      await StudentLevel.firstOrCreate({
        student_id: student.id,
        level_id: unit.level_id,
      }, {
        is_current: true,
        completed: false,
      })

      // Asignar la unidad actual
      await StudentUnit.firstOrCreate({
        student_id: student.id,
        unit_id: unit.id,
      }, {
        is_current: true,
        completed: false,
      })
    }
  }
}

