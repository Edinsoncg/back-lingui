import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import StudentAttendance from '#models/student_attendance'
import Unit from '#models/unit'
import Level from '#models/level'
import Modality from '#models/modality'

export default class ClassroomSession extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare classroom_id: number

  @column()
  declare modality_id: number

  @belongsTo(() => Modality, {
    foreignKey: 'level_id',
  })
  declare modality: BelongsTo<typeof Modality>

  @column()
  declare level_id: number

  @belongsTo(() => Level, {
    foreignKey: 'level_id',
  })
  declare level: BelongsTo<typeof Level>

  @column()
  declare unit_id: number

  @belongsTo(() => Unit, {
    foreignKey: 'unit_id',
  })
  declare unit: BelongsTo<typeof Unit>

  @column()
  declare component_id: number

  @column()
  declare teacher_user_language_id: number

  @column()
  declare class_type_id: number

  @column()
  declare start_at: DateTime

  @column()
  declare end_at: DateTime

  @column()
  declare duration: number

  @hasMany(() => StudentAttendance, {
    foreignKey: 'classroom_session_id',
  })
  declare attendances: HasMany<typeof StudentAttendance>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
