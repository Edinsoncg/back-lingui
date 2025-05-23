import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'units'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')
      table
        .bigInteger('module_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('modules')
        .onDelete('CASCADE')
      table
        .bigInteger('element_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('elements')
        .onDelete('CASCADE')
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
