import Workday from '#models/workday'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const workday = await Workday.create({
      journal: 'diurna',
    })
  }
}
