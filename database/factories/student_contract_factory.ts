import factory from '@adonisjs/lucid/factories'
import StudentContract from '#models/student_contract'
import { faker } from '@faker-js/faker'

let student = 1
export const StudentContractFactory = factory
  .define(StudentContract, async () => {
    student++
   return {
      student_id: student,
      contract_id: faker.number.int({ min: 1, max: 2 }),
      start_date: faker.date.past({ months: 4 }),
      end_date: faker.date.future({ years: 1 }),
      is_current: true,
    }
  })
  .build()
