import Unit from '#models/unit'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const unit = await Unit.createMany([
      {
        module_id: 1,
        element_id: 1,
      },
      {
        module_id: 1,
        element_id: 2,
      },
      {
        module_id: 1,
        element_id: 3,
      },
      {
        module_id: 2,
        element_id: 1,
      },
      {
        module_id: 2,
        element_id: 2,
      },
      {
        module_id: 2,
        element_id: 3,
      },
      {
        module_id: 3,
        element_id: 1,
      },
      {
        module_id: 3,
        element_id: 2,
      },
      {
        module_id: 3,
        element_id: 3,
      },
      {
        module_id: 4,
        element_id: 1,
      },
      {
        module_id: 4,
        element_id: 2,
      },
      {
        module_id: 4,
        element_id: 3,
      },
      {
        module_id: 5,
        element_id: 1,
      },
      {
        module_id: 5,
        element_id: 2,
      },
      {
        module_id: 5,
        element_id: 3,
      },
      {
        module_id: 6,
        element_id: 1,
      },
      {
        module_id: 6,
        element_id: 2,
      },
      {
        module_id: 6,
        element_id: 3,
      },
      {
        module_id: 7,
        element_id: 1,
      },
      {
        module_id: 7,
        element_id: 2,
      },
      {
        module_id: 7,
        element_id: 3,
      },
      {
        module_id: 8,
        element_id: 1,
      },
      {
        module_id: 8,
        element_id: 2,
      },
      {
        module_id: 8,
        element_id: 3,
      },
      {
        module_id: 9,
        element_id: 1,
      },
      {
        module_id: 9,
        element_id: 2,
      },
      {
        module_id: 9,
        element_id: 3,
      },
      {
        module_id: 10,
        element_id: 1,
      },
      {
        module_id: 10,
        element_id: 2,
      },
      {
        module_id: 10,
        element_id: 3,
      },
      {
        module_id: 11,
        element_id: 1,
      },
      {
        module_id: 11,
        element_id: 2,
      },
      {
        module_id: 11,
        element_id: 3,
      },
      {
        module_id: 12,
        element_id: 1,
      },
      {
        module_id: 12,
        element_id: 2,
      },
      {
        module_id: 12,
        element_id: 3,
      },
    ])
  }
}
