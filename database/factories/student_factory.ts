import factory from '@adonisjs/lucid/factories'
import Student from '#models/student'
import { faker } from '@faker-js/faker'

let user = 1
let code = 2025

export const StudentFactory = factory
  .define(Student, async () => {

    user++
    code++
    return {
      user_id: user,
      student_code: code++,
      status_id: 1,
    }
  })
  .build()
