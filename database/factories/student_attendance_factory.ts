import factory from '@adonisjs/lucid/factories'
import StudentAttendance from '#models/student_attendance'

export const StudentAttendanceFactory = factory
  .define(StudentAttendance, async ({ faker }) => {
    return {}
  })
  .build()