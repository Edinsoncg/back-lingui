import factory from '@adonisjs/lucid/factories'
import RoleDashboardComponent from '#models/role_dashboard_component'
import { faker } from '@faker-js/faker'

export const RoleDashboardComponentFactory = factory
  .define(RoleDashboardComponent, async () => {
    return {
      role_id: faker.number.int({ min: 1, max: 4 }),
      dashboard_component_id: faker.number.int({ min: 1, max: 5 }),
    }
  })
  .build()
