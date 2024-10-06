import type { HttpContext } from '@adonisjs/core/http'
import Transaction from '../../Websites/Models/transaction.js'

export default class ReportsController {
    async sales({ inertia }: HttpContext) {
        return inertia.render('reports/sales')
    }

    async generateSales({ request, response }: HttpContext) { 
        const { transaction, startDate, endDate } = request.qs()
        const salesQuery = await Transaction.query()
            .match(
                [
                    (transaction === 'onsite'), (query) => query.select('*').where('source', 'onsite')
                ],
                [
                    (transaction === 'online'), (query) => query.select('*').where('source', 'online')
                ],
                (query) => query.select('*')
            )
            .whereBetween('createdAt', [`${startDate} 00:00:00`, `${endDate} 23:59:59`])
            .preload('order', (order) => order.preload('orderProducts', (orderProduct) => orderProduct.preload('products')).preload('user'))
            .preload('payment')

        const sales = salesQuery.map(sales => ({
            id: sales.id,
            invoice: sales.invoice,
            paymentMethod: sales.payment.paymentMethod,
            totalPrice: sales.order.orderProducts.reduce((total, orderProduct) => total + orderProduct.products.price, 0),
            items: sales.order.orderProducts.map((orderProduct) => ({
                name: orderProduct.products.name,
                sku: orderProduct.products.sku,
                color: orderProduct.products.color,
                storage: orderProduct.products.storage
            })),
        }))

        return response.status(200).json({
            success: true,
            sales,
        })
    }

}