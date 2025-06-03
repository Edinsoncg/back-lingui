import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import StudentAttendance from '#models/student_attendance'
import Unit from '#models/unit'
import Modality from '#models/modality'
import TeacherUserLanguage from '#models/teacher_user_language'
import Classroom from '#models/classroom'

export default class ClassroomSession extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare classroom_id: number

  @column()
  declare modality_id: number

  @column()
  declare unit_id: number

  @column()
  declare teacher_user_language_id: number

  @column()
  declare class_type_id: number

  @column()
  declare start_at: Date

  @column()
  declare end_at: Date

  @column()
  declare duration: number

  @belongsTo(() => Classroom, {
    foreignKey: 'classroom_id',
  })
  declare classroom: BelongsTo<typeof Classroom>

  @belongsTo(() => Modality, {
    foreignKey: 'modality_id',
  })
  declare modality: BelongsTo<typeof Modality>

  @belongsTo(() => Unit, {
    foreignKey: 'unit_id',
  })
  declare unit: BelongsTo<typeof Unit>

  @belongsTo(() => TeacherUserLanguage, {
    foreignKey: 'teacher_user_language_id',
  })
  declare teacher: BelongsTo<typeof TeacherUserLanguage>

  @hasMany(() => StudentAttendance, {
    foreignKey: 'classroom_session_id',
  })
  declare attendances: HasMany<typeof StudentAttendance>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
