import { UserFactory } from '#database/factories/user_factory'
import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const user = await User.create({
      first_name: 'adonis',
      first_last_name: 'v6',
      second_last_name: 'test',
      profile_picture: null,
      document_type_id: 1,
      document_number: '123456789',
      email: 'adonis@gmail.com',
      password: '1234',
      phone_number: '123456789',
      workday_id: null,
    })
    await UserFactory.createMany(99)
  }
}
