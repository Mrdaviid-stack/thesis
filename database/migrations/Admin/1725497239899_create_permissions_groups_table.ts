import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'group_permission'

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.integer('permission_id').unsigned().references('id').inTable('permissions').onDelete('CASCADE')
            table.integer('group_id').unsigned().references('id').inTable('groups').onDelete('CASCADE')
        })
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}