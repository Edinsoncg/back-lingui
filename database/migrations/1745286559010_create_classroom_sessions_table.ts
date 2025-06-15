import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'classroom_sessions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')
      table
        .bigInteger('classroom_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('classrooms')
        .onDelete('CASCADE')
      table
        .bigInteger('modality_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('modalities')
        .onDelete('CASCADE')
      table
        .bigInteger('unit_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('units')
        .onDelete('CASCADE')
      table
        .bigInteger('teacher_user_language_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('teacher_user_languages')
        .onDelete('CASCADE')
      table
        .bigInteger('class_type_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('class_types')
        .onDelete('CASCADE')
      table.datetime('start_at').notNullable()
      table.datetime('end_at').notNullable()
      table.integer('duration').notNullable().unsigned()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
