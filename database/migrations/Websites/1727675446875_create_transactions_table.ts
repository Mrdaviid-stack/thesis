import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transactions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('order_id')
        .unsigned()
        .references('id')
        .inTable('orders')
        .onDelete('CASCADE')
        .onUpdate('RESTRICT')
      table.integer('payment_id')
        .unsigned()
        .references('id')
        .inTable('payments')
        .onDelete('CASCADE')
        .onUpdate('RESTRICT')
      table.enu('source', ['onsite','online']).defaultTo('onsite')
      table.enu('status', ['pending','order-placed','out-for-delivery','order-received','delivered','completed']).defaultTo('pending')
      table.string('tax')
      table.string('bundle')
      table.string('invoice')

      table.timestamp('created_at')
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}