import factory from '@adonisjs/lucid/factories'
import StudentUnit from '#models/student_unit'
import Student from '#models/student'
import Unit from '#models/unit'
import StudentLevel from '#models/student_level'

export const StudentUnitFactory = factory
  .define(StudentUnit, async () => {
    const student = await Student.query().orderBy('id', 'asc').firstOrFail()

    // Encuentra el nivel actual del estudiante
    const studentLevel = await StudentLevel.query()
      .where('student_id', student.id)
      .where('is_current', true)
      .firstOrFail()

    // Encuentra la primera unidad de ese nivel
    const unit = await Unit.query()
      .where('level_id', studentLevel.level_id)
      .orderBy('sequence_order', 'asc')
      .firstOrFail()

    return {
      student_id: student.id,
      unit_id: unit.id,
      is_current: true,
      completed: false,
    }
  })
  .build()
