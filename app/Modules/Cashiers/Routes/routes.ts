import router from "@adonisjs/core/services/router";
import InventoriesController from "../Controllers/inventories_controller.js";
import WalkInOrdersController from "../Controllers/walk_in_orders_controller.js";
import OrdersController from "../Controllers/order_trackings_controller.js";
import OrderAcknowledgementsController from "../Controllers/order_acknowledgements_controller.js";

const CashiersRouter = () => {
    router.group(() => {
        router.get('/', [InventoriesController, 'index'])
    }).prefix('cashiers/inventories')

    router.group(() => {
        router.get('/', [WalkInOrdersController, 'index'])
        router.get('details/:id', [WalkInOrdersController, 'details'])
        router.post('orders', [WalkInOrdersController, 'saveOrder'])
        router.get('billing/:id', [WalkInOrdersController, 'billing'])
        router.post('payment', [WalkInOrdersController, 'payment'])
       // router.post('store/:id', [WalkInOrdersController, 'store'])
    }).prefix('cashiers/walk-in-orders')

    router.group(() => {
        router.get('/', [OrdersController, 'index'])
    }).prefix('cashiers/order-trackings')

    router.group(() => {
        router.get('/', [OrderAcknowledgementsController, 'index'])
        router.put('/status/:transactionId/:status', [OrderAcknowledgementsController, 'updateOrderStatus'])
    }).prefix('cashiers/order-acknowledgements')
}

export default CashiersRouter