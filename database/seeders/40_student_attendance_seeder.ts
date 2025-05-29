import { StudentAttendanceFactory } from '#database/factories/student_attendance_factory'
import StudentAttendance from '#models/student_attendance'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const studentAttendance = await StudentAttendance.createMany([
      {
        student_contract_id: 1,
        classroom_session_id: 1,
      },
      {
        student_contract_id: 1,
        classroom_session_id: 2,
      },
      {
        student_contract_id: 1,
        classroom_session_id: 3,
      },
      {
        student_contract_id: 2,
        classroom_session_id: 1,
      },
      {
        student_contract_id: 2,
        classroom_session_id: 2,
      },
      {
        student_contract_id: 2,
        classroom_session_id: 3,
      },
      {
        student_contract_id: 3,
        classroom_session_id: 1,
      },
      {
        student_contract_id: 3,
        classroom_session_id: 2,
      },
      {
        student_contract_id: 3,
        classroom_session_id: 3,
      },
    ])
    await StudentAttendanceFactory.createMany(69)
  }
}
