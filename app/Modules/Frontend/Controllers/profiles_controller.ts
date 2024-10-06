import type { HttpContext } from '@adonisjs/core/http'
import Transaction from '../../Websites/Models/transaction.js'

export default class ProfilesController {

    async index({ inertia }: HttpContext) {
        return inertia.render('Frontend/profile/profile')
    }

    async orders({ response, params }: HttpContext) {
        console.log(params)
        const orders = await Transaction.query()
            .preload('order', (order) => 
                    order.where('userId', params.id).preload('orderProducts', (orderProduct) => 
                        orderProduct.preload('products')).preload('user')).preload('payment')

        return response.status(200).json({
            success: true,
            orders
        })
    }

}