import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import Permission from '#models/permission'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class PermissionItem extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare permission_id: number

  @column()
  declare item_id: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Permission, {
    foreignKey: 'permission_id',
  })
  declare permission: BelongsTo<typeof Permission>
}
