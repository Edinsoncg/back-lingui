import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import House from '#models/house'
import ClassroomSession from '#models/classroom_session'
import { DateTime } from 'luxon'

export default class Classroom extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare capacity: number

  @column()
  declare house_id: number

  // 🔗 Relación con House
  @belongsTo(() => House, {
    foreignKey: 'house_id',
  })
  declare house: BelongsTo<typeof House>

  // 🔗 Relación con ClassroomSession
  @hasMany(() => ClassroomSession, {
    foreignKey: 'classroom_id',
  })
  declare classroomSessions: HasMany<typeof ClassroomSession>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
