import factory from '@adonisjs/lucid/factories'
import StudentAttendance from '#models/student_attendance'
import { faker } from '@faker-js/faker'

let student = 1
let classroomSession = 1

export const StudentAttendanceFactory = factory
  .define(StudentAttendance, async () => {
    student++
    classroomSession++
    return {
      student_id: student,
      classroom_session_id: classroomSession,
    }
  })
  .build()
