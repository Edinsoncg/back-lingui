import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'support_materials'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table
        .bigInteger('level_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('levels')
        .onDelete('CASCADE')
      table.string('description').notNullable()
      table.string('link').notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
