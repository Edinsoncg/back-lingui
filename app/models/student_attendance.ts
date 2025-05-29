import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import StudentContract from '#models/student_contract'
import ClassroomSession from '#models/classroom_session'

export default class StudentAttendance extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare student_contract_id: number

  @column()
  declare classroom_session_id: number

  @belongsTo(() => StudentContract, {
    foreignKey: 'student_contract_id',
  })
  declare student_contract: BelongsTo<typeof StudentContract>

  @belongsTo(() => ClassroomSession, {
    foreignKey: 'classroom_session_id',
  })
  declare classroomSession: BelongsTo<typeof ClassroomSession>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
