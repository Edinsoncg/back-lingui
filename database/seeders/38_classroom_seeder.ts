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
      {
        name: 'Alejandria',
        capacity: 10,
        house_id: 2,
      },
      {
        name: 'China',
        capacity: 8,
        house_id: 3,
      },
      {
        name: 'Russia',
        capacity: 9,
        house_id: 1,
      },
      {
        name: 'Portugal',
        capacity: 10,
        house_id: 3,
      },
      {
        name: 'Madrid',
        capacity: 6,
        house_id: 1,
      },
      {
        name: 'Suiza',
        capacity: 6,
        house_id: 2,
      },
      {
        name: 'Pekin',
        capacity: 8,
        house_id: 3,
      },
      {
        name: 'Hawai',
        capacity: 9,
        house_id: 1,
      },
      {
        name: 'Texas',
        capacity: 10,
        house_id: 3,
      },
      {
        name: 'Narnia',
        capacity: 6,
        house_id: 1,
      },
      {
        name: 'Napoles',
        capacity: 6,
        house_id: 2,
      },
    ])
  }
}
