import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'groups'

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary().notNullable()
            table.string('name', 50).notNullable()
            table.string('description')
            table.timestamp('created_at').notNullable()
            table.timestamp('updated_at').nullable()
            table.timestamp('deleted_at').nullable()
        })
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}