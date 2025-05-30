import factory from '@adonisjs/lucid/factories'
import StudentLevel from '#models/student_level'
import Student from '#models/student'
import Level from '#models/level'

export const StudentLevelFactory = factory
  .define(StudentLevel, async () => {
    const student = await Student.query().orderBy('id', 'asc').firstOrFail()
    const level = await Level.query().orderBy('sequence_order', 'asc').firstOrFail()

    return {
      student_id: student.id,
      level_id: level.id,
      is_current: true,
      completed: false,
    }
  })
  .build()
