import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary().notNullable()
      table.string('sku', 64).unique()
      table.string('model_number')
      table.string('name')
      table.text('description')
      table.float('price')
      table.string('color')
      table.string('storage')
      table.string('ram')
      table.integer('stock')
      table.integer('category_id')
        .unsigned()
        .references('id')
        .inTable('categories')
        .onDelete('CASCADE')
        .onUpdate('RESTRICT')
      table.enu('status', ['active','draft'])
      table.timestamp('created_at')
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}