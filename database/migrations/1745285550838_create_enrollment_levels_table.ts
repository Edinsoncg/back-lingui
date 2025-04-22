import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'enrollment_levels'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')
      table
        .bigInteger('student_language_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('student_languages')
        .onDelete('CASCADE')
      table
        .bigInteger('level_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('levels')
        .onDelete('CASCADE')
      table.date('start_date').notNullable()
      table.date('end_date').notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
