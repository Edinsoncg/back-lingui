import factory from '@adonisjs/lucid/factories'
import StudentContract from '#models/student_contract'

export const StudentContractFactory = factory
  .define(StudentContract, async () => {
    return {
      student_id: 1,
      contract_id: 1,
    }
  })
  .build()