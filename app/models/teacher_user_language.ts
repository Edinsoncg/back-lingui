import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Language from '#models/language'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

export default class TeacherUserLanguage extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare user_id: number

  @column()
  declare language_id: number

  @belongsTo(() => Language, {
    foreignKey: 'language_id',
  })
  declare language: BelongsTo<typeof Language>

  @belongsTo(() => User, {
    foreignKey: 'user_id',
  })
  declare user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
