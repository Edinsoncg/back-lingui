import { StudentAttendanceFactory } from '#database/factories/student_attendance_factory'
import StudentAttendance from '#models/student_attendance'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const studentAttendance = await StudentAttendance.create({
      student_id: 1,
      classroom_session_id: 1,
    })
    await StudentAttendanceFactory.createMany(69)
  }
}
