import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

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
}
