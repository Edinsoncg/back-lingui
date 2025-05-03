import { BaseModel, column } from "@adonisjs/lucid/orm"
import { DateTime } from "luxon"

export default class SupportMaterial extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare level_id: number

  @column()
  declare description: string

  @column()
  declare link: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
