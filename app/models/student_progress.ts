import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Level from '#models/level'
import Unit from '#models/unit'
import Component from '#models/component'

export default class StudentProgress extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare student_id: number

  @column()
  declare level_id: number

  @column()
  declare unit_id: number

  @column()
  declare component_id: number

  @belongsTo(() => Level, {
    foreignKey: 'level_id',
  })
  declare level: BelongsTo<typeof Level>

  @belongsTo(() => Unit, {
    foreignKey: 'unit_id',
  })
  declare unit: BelongsTo<typeof Unit>

  @belongsTo(() => Component, {
    foreignKey: 'component_id',
  })
  declare component: BelongsTo<typeof Component>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
