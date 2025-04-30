import { BaseSeeder } from '@adonisjs/lucid/seeders'
import StudentContract from '#models/student_contract'
import { StudentContractFactory } from '#database/factories/student_contract_factory'
import { start } from 'repl'

export default class extends BaseSeeder {
  async run() {
    const studentContracts = await StudentContract.create({
      student_id: 1,
      contract_id: 1,
      start_date: '2025-01-01',
      end_date: '2025-06-30',
    })
    await StudentContractFactory.createMany(69)
  }
}
