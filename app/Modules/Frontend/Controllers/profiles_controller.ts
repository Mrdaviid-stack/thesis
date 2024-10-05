import type { HttpContext } from '@adonisjs/core/http'
import Transaction from '../../Websites/Models/transaction.js'

export default class ProfilesController {

    async index({ inertia }: HttpContext) {
        return inertia.render('Frontend/profile/profile')
    }

    async orders({ response, params }: HttpContext) {
        console.log(params)
        const orders = await Transaction.query().where('status', params.status) 
            .preload('order', (order) => 
                    order.preload('orderProducts', (orderProduct) => 
                        orderProduct.preload('products')).preload('user', (user) => user.where('id', params.id))).preload('payment')

        return response.status(200).json({
            success: true,
            orders
        })
    }

}