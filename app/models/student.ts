import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import StudentContract from '#models/student_contract'
import StudentAttendance from '#models/student_attendance'
import Status from '#models/status'
import StudentLanguage from '#models/student_language'

export default class Student extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare user_id: number

  @column()
  declare student_code: string

  @column()
  declare status_id: number

  @belongsTo(() => User, {
    foreignKey: 'user_id',
  })
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Status, {
    foreignKey: 'status_id',
  })
  declare status: BelongsTo<typeof Status>

  @hasMany(() => StudentContract, {
    foreignKey: 'student_id',
  })
  declare contracts: HasMany<typeof StudentContract>

  @hasMany(() => StudentAttendance, {
    foreignKey: 'student_id',
  })
  declare attendances: HasMany<typeof StudentAttendance>

  @hasMany(() => StudentLanguage, {
    foreignKey: 'student_id',
  })
  declare studentLanguages: HasMany<typeof StudentLanguage>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
