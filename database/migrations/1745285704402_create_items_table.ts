import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')
      table.string('name').notNullable()
      table.text('url').notNullable()
      table.string('icon').notNullable()
      table
        .bigInteger('item_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('items')
        .onDelete('CASCADE')
        .nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
