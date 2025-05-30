import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Student from '#models/student'
import Unit from '#models/unit'

export default class StudentUnit extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare student_id: number

  @column()
  declare unit_id: number

  @column()
  declare is_current: boolean

  @column()
  declare completed: boolean

  @belongsTo(() => Student, {
    foreignKey: 'student_id',
  })
  declare studentUnit: BelongsTo<typeof Student>

  @belongsTo(() => Unit, {
    foreignKey: 'unit_id',
  })
  declare unit: BelongsTo<typeof Unit>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
