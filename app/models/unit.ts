import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Unit extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare element_id: number

  @column()
  declare module_id: number

  @belongsTo(() => Unit, {
    foreignKey: 'element_id',
  })
  declare element: BelongsTo<typeof Unit>

  @belongsTo(() => Unit, {
    foreignKey: 'module_id',
  })
  declare module: BelongsTo<typeof Unit>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
