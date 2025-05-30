import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'student_levels'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .bigInteger('student_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('students')
        .onDelete('CASCADE')
      table
        .bigInteger('level_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('levels')
        .onDelete('CASCADE')
      table.boolean('is_current').notNullable().defaultTo(false)
      table.boolean('completed').notNullable().defaultTo(false)
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
