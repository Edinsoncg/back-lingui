import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class ClassroomSession extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare classroom_id: number

  @column()
  declare modality_id: number

  @column()
  declare level_id: number

  @column()
  declare unit_id: number

  @column()
  declare teacher_user_language_id: number

  @column()
  declare start_date: DateTime

  @column()
  declare end_date: DateTime

  @column()
  declare duration: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
