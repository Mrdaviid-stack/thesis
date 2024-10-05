import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'users'

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').notNullable()
            table.string('firstname').nullable()
            table.string('lastname').nullable()
            table.string('username').notNullable().unique()
            table.string('email', 254).notNullable().unique()
            table.string('address', 254).notNullable().unique()
            table.string('password').notNullable()
            table.boolean('status').defaultTo(0)
            table.string('image').nullable()

            table.timestamp('created_at').notNullable()
            table.timestamp('updated_at').nullable()
            table.timestamp('deleted_at').nullable()
        })
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}