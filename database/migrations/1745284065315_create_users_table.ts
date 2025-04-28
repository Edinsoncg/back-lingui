import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')
      table.string('first_name').notNullable()
      table.string('middle_name').nullable()
      table.string('first_last_name').notNullable()
      table.string('second_last_name').notNullable()
      table
        .bigInteger('document_type_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('document_types')
        .onDelete('CASCADE')
      table.string('document_number').notNullable().unique()
      table.string('email', 254).notNullable().unique()
      table.string('password').notNullable()
      table.string('phone_number').nullable().unique()
      table
        .bigInteger('workday_id')
        .nullable()
        .unsigned()
        .references('id')
        .inTable('workdays')
        .onDelete('CASCADE')
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
