import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'student_attendances'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')
      table
        .bigInteger('student_contract_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('student_contracts')
        .onDelete('CASCADE')
      table
        .bigInteger('classroom_session_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('classroom_sessions')
        .onDelete('CASCADE')
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
