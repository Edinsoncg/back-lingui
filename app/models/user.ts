import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, belongsTo, hasOne, manyToMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import DocumentType from '#models/document_type'
import type { BelongsTo, HasOne, ManyToMany } from '@adonisjs/lucid/types/relations'
import Workday from '#models/workday'
import TeacherUserLanguage from './teacher_user_language.js'
import Role from '#models/role'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare first_name: string

  @column()
  declare middle_name: string | null

  @column()
  declare first_last_name: string

  @column()
  declare second_last_name: string

  @column()
  declare profile_picture: string | null

  @column()
  declare document_type_id: number

  @belongsTo(() => DocumentType, {
    foreignKey: 'document_type_id',
  })
  declare documentType: BelongsTo<typeof DocumentType>

  @manyToMany(() => Role, {
    pivotTable: 'user_roles',
    localKey: 'id', // user.id
    pivotForeignKey: 'user_id',
    relatedKey: 'id', // role.id
    pivotRelatedForeignKey: 'role_id',
  })
  public roles: ManyToMany<typeof Role>

  @column()
  declare document_number: string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare phone_number: string

  @column()
  declare workday_id: number | null

  @belongsTo(() => Workday, {
    foreignKey: 'workday_id',
  })
  declare workday: BelongsTo<typeof Workday>

  @column({
    consume: (value) => Boolean(value),
    serialize: (value: number) => Boolean(value),
  })
  declare is_active: boolean

  @hasOne(() => TeacherUserLanguage, {
    foreignKey: 'user_id',
  })
  declare teacherProfile: HasOne<typeof TeacherUserLanguage>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  static accessTokens = DbAccessTokensProvider.forModel(User, {
    expiresIn: '30 days',
    prefix: 'oat_',
    table: 'auth_access_tokens',
    type: 'auth_token',
    tokenSecretLength: 40,
  })
}
