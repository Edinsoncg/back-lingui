import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Student from '#models/student'
import Level from '#models/level'

export default class StudentLevel extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare student_id: number

  @column()
  declare level_id: number

  @column()
  declare is_current: boolean

  @column()
  declare completed: boolean

  @belongsTo(() => Student, {
    foreignKey: 'student_id',
  })
  declare studentLevel: BelongsTo<typeof Student>

  @belongsTo(() => Level, {
    foreignKey: 'level_id',
  })
  declare level: BelongsTo<typeof Level>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
