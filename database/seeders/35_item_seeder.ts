import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Item from '#models/item'

export default class ItemSeeder extends BaseSeeder {
  public async run() {
    await Item.createMany([
      { name: 'Dashboard', url: '/dashboard', icon: 'mdi-view-dashboard-outline', item_id: null },
      { name: 'Agenda', url: '/agenda', icon: 'mdi-calendar-month-outline', item_id: null },
      { name: 'Mi Perfil', url: '/profile', icon: 'mdi-account-circle-outline', item_id: null },
      { name: 'Seguimiento Académico', url: '/progress/academic', icon: 'mdi-school-outline', item_id: null },
      { name: 'Seguimiento Contrato', url: '/progress/contract', icon: 'mdi-file-document-outline', item_id: null },
      { name: 'Material de Soporte', url: '/support-material', icon: 'mdi-bookshelf', item_id: null },
      { name: 'Reporte Estudiantes', url: '/report-student', icon: 'mdi-account-multiple-outline', item_id: null },
      { name: 'Reporte Salones', url: '/report/classroom', icon: 'mdi-door-open', item_id: null },
      { name: 'Reporte Profesores', url: '/report/teacher', icon: 'mdi-account-tie', item_id: null },
      { name: 'Usuarios', url: '/setting/user', icon: 'mdi-account-cog-outline', item_id: null },
      { name: 'Usuarios Inactivos', url: '/setting/inactive-user', icon: 'mdi-account-off-outline', item_id: null },
      { name: 'Permisos', url: '/configuracion/permisos', icon: 'mdi-shield-key-outline', item_id: null },
      { name: 'Lenguaje y Notificaciones', url: '/configuracion/lenguaje-notificaciones', icon: 'mdi-earth', item_id: null },
      { name: 'Soporte', url: '/soporte', icon: 'mdi-lifebuoy', item_id: null },
    ])
  }
}
