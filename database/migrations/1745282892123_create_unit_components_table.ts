import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'unit_components'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')
      table
        .bigInteger('unit_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('units')
        .onDelete('CASCADE')
      table
        .bigInteger('component_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('components')
        .onDelete('CASCADE')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

