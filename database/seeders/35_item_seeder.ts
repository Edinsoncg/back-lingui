// database/seeders/item_seeder.ts
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Item from '#models/item'

export default class ItemSeeder extends BaseSeeder {
  public async run() {
    // Padres
    const seguimiento = await Item.create({
      name: 'Mi Seguimiento',
      url: '',
      icon: 'mdi-chart-line',
      item_id: null,
    })

    const reportes = await Item.create({
      name: 'Reportes',
      url: '',
      icon: 'mdi-file-chart',
      item_id: null,
    })

    const configuracion = await Item.create({
      name: 'Configuración',
      url: '',
      icon: 'mdi-cog-outline',
      item_id: null,
    })

    // Hijos e independientes
    await Item.createMany([
      { name: 'Dashboard', url: '/dashboard', icon: 'mdi-view-dashboard-outline', item_id: null },
      { name: 'Agenda', url: '/agenda', icon: 'mdi-calendar-month-outline', item_id: null },
      { name: 'Mi Perfil', url: '/profile', icon: 'mdi-account-circle-outline', item_id: null },

      // Seguimiento académico y contrato
      { name: 'Académico', url: '/progress/academic', icon: 'mdi-school-outline', item_id: seguimiento.id },
      { name: 'Contrato', url: '/progress/contract', icon: 'mdi-file-document-outline', item_id: seguimiento.id },

      // Material independiente
      { name: 'Material de Soporte', url: '/support-material', icon: 'mdi-bookshelf', item_id: null },

      // Reportes
      { name: 'Estudiantes', url: '/report-student', icon: 'mdi-account-multiple-outline', item_id: reportes.id },
      { name: 'Salones', url: '/report/classroom', icon: 'mdi-door-open', item_id: reportes.id },
      { name: 'Profesores', url: '/report/teacher', icon: 'mdi-account-tie', item_id: reportes.id },

      // Soporte
      { name: 'Soporte', url: '/soporte', icon: 'mdi-lifebuoy', item_id: null },

      // Configuración
      { name: 'Usuarios', url: '/setting/user', icon: 'mdi-account-cog-outline', item_id: configuracion.id },
      { name: 'Usuarios Inactivos', url: '/setting/inactive-user', icon: 'mdi-account-off-outline', item_id: configuracion.id },
      { name: 'Permisos', url: '/configuracion/asignar-permisos', icon: 'mdi-shield-key-outline', item_id: configuracion.id },
      { name: 'Lenguaje y Notificaciones', url: '/configuracion/lenguaje-notificaciones', icon: 'mdi-earth', item_id: configuracion.id },
    ])
  }
}
