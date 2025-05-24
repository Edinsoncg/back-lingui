import Component from '#models/component'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const component = await Component.createMany([
      { name: 'Speaking' },
      { name: 'Writing' },
      { name: 'Listening' },
      { name: 'Reading' },
      { name: 'Grammar' },
      { name: 'Vocabulary' },
    ])
  }
}
