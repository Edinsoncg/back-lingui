import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class EnrollmentLevelUnit extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare enrollment_level_id: number

  @column()
  declare unit_id: number

  @column()
  declare start_date: DateTime

  @column()
  declare end_date: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
