import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Student from '#models/student'
import Contract from '#models/contract'
import StudentAttendance from '#models/student_attendance'

export default class StudentContract extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare student_id: number

  @column()
  declare contract_id: number

  @column()
  declare start_date: DateTime

  @column()
  declare end_date: DateTime

  @belongsTo(() => Student, {
    foreignKey: 'student_id',
  })
  declare student: BelongsTo<typeof Student>

  @belongsTo(() => Contract, {
    foreignKey: 'contract_id',
  })
  declare contract: BelongsTo<typeof Contract>

  @hasMany(() => StudentAttendance, {
    foreignKey: 'student_contract_id',
  })
  declare attendances: HasMany<typeof StudentAttendance>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
