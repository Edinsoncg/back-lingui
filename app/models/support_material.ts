import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Level from '#models/level'
import { DateTime } from 'luxon'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class SupportMaterial extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare level_id: number

  @column()
  declare description: string

  @column()
  declare link: string

  @belongsTo(() => Level, {
    foreignKey: 'level_id',
  })
  declare level: BelongsTo<typeof Level>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
