import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import Role from '#models/role'
import Permission from '#models/permission'
import Item from '#models/item'

export default class RolePermissionItem extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare role_id: number

  @column()
  declare permission_id: number

  @column()
  declare item_id: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relaciones

  @belongsTo(() => Role, {
    foreignKey: 'role_id',
  })
  declare role: BelongsTo<typeof Role>

  @belongsTo(() => Permission, {
    foreignKey: 'permission_id',
  })
  declare permission: BelongsTo<typeof Permission>

  @belongsTo(() => Item, {
    foreignKey: 'item_id',
  })
  declare item: BelongsTo<typeof Item>
}
