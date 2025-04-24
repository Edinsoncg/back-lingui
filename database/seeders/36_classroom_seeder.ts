import Classroom from '#models/classroom'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const classroom = await Classroom.createMany([
      {
        name: 'Paris',
        capacity: 6,
        house_id: 1,
      },
      {
        name: 'Tokio',
        capacity: 5,
        house_id: 2,
      },
      {
        name: 'Roma',
        capacity: 8,
        house_id: 3,
      },
      {
        name: 'Berlin',
        capacity: 4,
        house_id: 1,
      },
      {
        name: 'Chicago',
        capacity: 5,
        house_id: 2,
      },
    ])
  }
}
