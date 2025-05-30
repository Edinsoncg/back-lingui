import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Language from '#models/language'

export default class StudentLanguage extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare student_id: number

  @column()
  declare language_id: number

  @belongsTo(() => Language, {
    foreignKey: 'language_id',
  })
  declare language: BelongsTo<typeof Language>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
