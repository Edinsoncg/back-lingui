import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Unit from '#models/unit'
import Component from '#models/component'
import StudentProgress from '#models/student_progress'

export default class UnitComponent extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare unit_id: number

  @column()
  declare component_id: number

  @belongsTo(() => Unit, {
    foreignKey: 'unit_id',
  })
  declare unit: BelongsTo<typeof Unit>

  @belongsTo(() => Component, {
    foreignKey: 'component_id',
  })
  declare component: BelongsTo<typeof Component>

  @hasMany(() => StudentProgress, {
    foreignKey: 'unit_component_id',
  })
  declare studentProgress: HasMany<typeof StudentProgress>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
