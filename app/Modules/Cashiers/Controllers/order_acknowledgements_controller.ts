import type { HttpContext } from '@adonisjs/core/http'
import Transaction from '../../Websites/Models/transaction.js'

export default class OrderAcknowledgementsController {
    async index({ inertia }: HttpContext) {
        const transactions = await Transaction.query().where('status', 'pending')
            .preload('order', (order) => 
                order.preload('orderProducts', (orderProduct) => 
                    orderProduct.preload('products')).preload('user')
        ).preload('payment')
        return inertia.render('cashiers/order-acknowledgement/order-acknowledgement', {
            transactions
        })
    }

    async updateOrderStatus({ response, params }: HttpContext) {
        const transaction = await Transaction.findOrFail(params.transactionId)
        await transaction.merge({ status: params.status }).save()
        return response.status(200).json({
            success: true,
            message: 'Order status updated successfully.'
        })
    }
}