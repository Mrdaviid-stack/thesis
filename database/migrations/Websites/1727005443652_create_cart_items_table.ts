import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cart_items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
        .primary()
        .notNullable()
      table.integer('cart_id')
        .unsigned()
        .references('id')
        .inTable('carts')
        .onDelete('CASCADE')
        .onUpdate('RESTRICT')
      table.integer('product_id')
        .unsigned()
        .references('id')
        .inTable('products')
        .onDelete('CASCADE')
        .onUpdate('RESTRICT')
      table.integer('quantity')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}