import Contract from '#models/contract'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const contract = await Contract.createMany([
      {
        name: 'Normal',
        month_amount: 12,
        hour_amount_contract: 156,
        hour_amount_week: 3,
      },
      {
        name: 'Intensivo',
        month_amount: 6,
        hour_amount_contract: 156,
        hour_amount_week: 6,
      },
    ])
  }
}
