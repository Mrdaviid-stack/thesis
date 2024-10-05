import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '../../app/Modules/Admin/Models/user.js'
import Group from '../../app/Modules/Admin/Models/group.js'
import Permission from '../../app/Modules/Admin/Models/permission.js'

export default class extends BaseSeeder {
    async run() {
        // Write your database queries inside the run method
        await User.create({
            firstname: 'super',
            lastname: 'admin',
            username: 'superadmin',
            email: 'superadmin@noreply.com',
            address: 'blk 1 lot 2 address ST. Q.C',
            password: 'password1234',
            status: true,
        })

        await Group.createMany([
            { name: 'Superadmin', description: 'All Access' },
            { name: 'Admin', description: 'Limited Access' },
            { name: 'Custmer', description: 'Front Acccess' },
        ])

        await Permission.createMany([
            //
            { name: 'admin-dashboard-view', description: 'Dashboard' },
            { name: 'admin-users-view', description: 'View users' },
            { name: 'admin-users-index', description: 'List users' },
            { name: 'admin-users-add', description: 'Add users' },
            { name: 'admin-users-edit', description: 'Edit users' },
            { name: 'admin-users-delete', description: 'Delete users' },
            //
            { name: 'admin-groups-view', description: 'View groups' },
            { name: 'admin-groups-index', description: 'List groups' },
            { name: 'admin-groups-add', description: 'Add groups' },
            { name: 'admin-groups-edit', description: 'Edit groups' },
            { name: 'admin-groups-delete', description: 'Delete groups' },
            //
            { name: 'websites-pages-view', description: 'View pages' },
            { name: 'websites-pages-index', description: 'List pages' },
            { name: 'websites-pages-add', description: 'Add pages' },
            { name: 'websites-pages-edit', description: 'Edit pages' },
            { name: 'websites-pages-delete', description: 'Delete pages' },
            //
            { name: 'websites-categories-view', description: 'View categories' },
            { name: 'websites-categories-index', description: 'List categories' },
            { name: 'websites-categories-add', description: 'Add categories' },
            { name: 'websites-categories-edit', description: 'Edit categories' },
            { name: 'websites-categories-delete', description: 'Delete categories' },
            //
            { name: 'websites-products-view', description: 'View products' },
            { name: 'websites-products-index', description: 'List products' },
            { name: 'websites-products-add', description: 'Add products' },
            { name: 'websites-products-edit', description: 'Edit products' },
            { name: 'websites-products-delete', description: 'Delete products' },
            //
            { name: 'cashiers-cashiers-view', description: 'Cashiers' },
            //
            { name: 'cashiers-order_acknowledgement-view', description: 'View order acknowledgement' },
            { name: 'cashiers-order_acknowledgement-index', description: 'List order acknowledgement' },
            { name: 'cashiers-order_acknowledgement-add', description: 'Add order acknowledgement' },
            { name: 'cashiers-order_acknowledgement-edit', description: 'Edit order acknowledgement' },
            { name: 'cashiers-order_acknowledgement-delete', description: 'Delete order acknowledgement' },
            //
            { name: 'cashiers-order_tracking-view', description: 'View order tracking' },
            { name: 'cashiers-order_tracking-index', description: 'List order tracking' },
            { name: 'cashiers-order_tracking-add', description: 'Add order tracking' },
            { name: 'cashiers-order_tracking-edit', description: 'Edit order tracking' },
            { name: 'cashiers-order_tracking-delete', description: 'Delete order tracking' },
            //
            { name: 'cashiers-inventories-view', description: 'View inventories' },
            { name: 'cashiers-inventories-index', description: 'List inventories' },
            { name: 'cashiers-inventories-add', description: 'Add inventories' },
            { name: 'cashiers-inventories-edit', description: 'Edit inventories' },
            { name: 'cashiers-inventories-delete', description: 'Delete inventories' },
            //
            { name: 'cashiers-walk_in_orders-view', description: 'View walk in orders' },
            { name: 'cashiers-walk_in_orders-index', description: 'List walk in orders' },
            { name: 'cashiers-walk_in_orders-add', description: 'Add walk in orders' },
            { name: 'cashiers-walk_in_orders-edit', description: 'Edit walk in orders' },
            { name: 'cashiers-walk_in_orders-delete', description: 'Delete walk in orders' },

        ])

        await this.usersGroup()

        await this.permissionsGroup()

    }

    async usersGroup() {
        const groups = await Group.findByOrFail('name', 'Superadmin')
        await groups.related('users').attach([1])
        // const user = await User.findByOrFail('username', 'superadmin')
        // await user.related('groups').attach([1])
    }

    async permissionsGroup() {
        const group = await Group.findByOrFail('name', 'Superadmin')
        const permissions = await Permission.all()

        const ids: number[] = []

        permissions.map((permission) => ids.push(permission.id))

        group.related('permissions').attach(ids)
    }
}