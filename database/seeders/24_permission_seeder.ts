import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Permission from '#models/permission'

export default class PermissionSeeder extends BaseSeeder {
  public async run() {
    await Permission.createMany([
      {
        name: 'view',
        label: 'Ver',
        icon: 'mdi-eye',
        iconColor: 'blue',
      },
      {
        name: 'create',
        label: 'Crear',
        icon: 'mdi-plus',
        iconColor: 'green',
      },
      {
        name: 'edit',
        label: 'Editar',
        icon: 'mdi-pencil',
        iconColor: 'orange',
      },
      {
        name: 'delete',
        label: 'Eliminar',
        icon: 'mdi-delete',
        iconColor: 'red',
      },
      {
        name: 'add',
        label: 'Agregar',
        icon: 'mdi-plus-circle',
        iconColor: 'purple',
      },
      {
        name: 'cancel',
        label: 'Cancelar',
        icon: 'mdi-cancel',
        iconColor: 'grey',
      },
      {
        name: 'inactive',
        label: 'Inactivar',
        icon: 'mdi-account-off',
        iconColor: 'yellow',
      },
      {
        name: 'restore',
        label: 'Restaurar',
        icon: 'mdi-restore',
        iconColor: 'teal',
      },
    ])
  }
}
