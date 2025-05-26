import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Student from '#models/student'
import UnitComponent from '#models/unit_component'

export default class StudentProgress extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare student_id: number

  @column()
  declare unit_component_id: number

  @column()
  declare status: 'active' | 'archived'

  @belongsTo(() => Student, {
    foreignKey: 'student_id',
  })
  declare student: BelongsTo<typeof Student>

  @belongsTo(() => UnitComponent, {
    foreignKey: 'unit_component_id',
  })
  declare unit_component: BelongsTo<typeof UnitComponent>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
