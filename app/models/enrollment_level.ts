import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class EnrollmentLevel extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare student_language_id: number

  @column()
  declare level_id: number

  @column()
  declare start_date: DateTime

  @column()
  declare end_date: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
