import Role from '#models/role'
import { BaseSeeder } from '@adonisjs/lucid/seeders'


export default class extends BaseSeeder {
  async run() {
    const role = await Role.createMany([
      { name: 'Administrativo' },
      { name: 'Recepcionista' },
      { name: 'Profesor' },
      { name: 'Estudiante' },
    ])
  }
}
