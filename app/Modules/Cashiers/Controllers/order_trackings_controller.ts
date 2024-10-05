import type { HttpContext } from '@adonisjs/core/http'
import Transaction from '../../Websites/Models/transaction.js'

export default class OrderTrackingsController {


    async index({inertia}: HttpContext) {
        const orders = await Transaction.query()
            .preload('order', (order) => 
                order.preload('orderProducts', (orderProduct) => 
                    orderProduct.preload('products')).preload('user')
            ).preload('payment')
        return inertia.render('cashiers/order-trackings/order-trackings', { orders})
    }

}