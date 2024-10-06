import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'order_products'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      .primary()
      .notNullable()
    table.integer('order_id')
      .unsigned()
      .references('id')
      .inTable('orders')
      .onDelete('CASCADE')
      .onUpdate('RESTRICT')
    table.integer('product_id')
      .unsigned()
      .references('id')
      .inTable('products')
      .onDelete('CASCADE')
      .onUpdate('RESTRICT')
    table.integer('quantity')
    table.float('price')

      table.timestamp('created_at')
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}