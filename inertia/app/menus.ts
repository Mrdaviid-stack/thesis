export const navItems = [
    {
        permissions: 'admin-dashboard-view',
        route: '/dashboard',
        name: 'Dashboard',
        icon: 'fa-house'
    },
    {
        permissions: 'cashiers-cashiers-view',
        route: 'cashiers',
        name: 'Cashiers',
        icon: 'fa-house',
        sub_item: [
            {
                permissions: 'cashiers-order_acknowledgement-view',
                route: '/dashboard/cashiers/order-acknowledgements',
                name: 'Order Acknowledgement',
            },
            {
                permissions: 'cashiers-order_tracking-view',
                route: '/dashboard/cashiers/order-trackings',
                name: 'Order Tracking',
            },
            {
                permissions: 'cashiers-inventories-view',
                route: '/dashboard/cashiers/inventories',
                name: 'Inventories',
            },
            {
                permissions: 'cashiers-walk_in_orders-view',
                route: '/dashboard/cashiers/walk-in-orders',
                name: 'Walk in orders',
            },
        ]
    },
    {
        permissions: 'websites-pages-view',
        route: 'websites',
        name: 'Websites',
        icon: 'fa-window-maximize',
        sub_item: [
            {
                permissions: 'websites-pages-view',
                route: '/dashboard/websites/pages',
                name: 'Pages',
            },
            {
                permissions: 'websites-categories-view',
                route: '/dashboard/websites/categories',
                name: 'Categories',
                icon: 'fa-house'
            },
            {
                permissions: 'websites-products-view',
                route: '/dashboard/websites/products',
                name: 'Products',
                icon: 'fa-house'
            },
        ]
    },
    {
        permissions: 'admin-users-view',
        route: 'admin',
        name: 'Admin',
        icon: 'fa-user-tie',
        sub_item: [
            {
                permissions: 'admin-groups-view',
                route: '/dashboard/admin/groups',
                name: 'Groups',
            },
            {
                permissions: 'admin-users-view',
                route: '/dashboard/admin/users',
                name: 'Users',
            },
        ]
    },
]