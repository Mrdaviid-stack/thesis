import type { HttpContext } from '@adonisjs/core/http'
import Product from '../../Websites/Models/product.js'
import _ from 'lodash'
import Order from '../../Websites/Models/order.js'
import OrderProduct from '../../Websites/Models/order_product.js'
import Payment from '../../Websites/Models/payment.js'

export default class WalkInOrdersController {

    async index({ inertia }: HttpContext) {
        const products = await Product.all()
        return inertia.render("cashiers/walk-in-orders/walk-in-orders", {
            products: products
        })
    }

    async details({ inertia, params }: HttpContext) {
        return inertia.render("cashiers/walk-in-orders/details", {
            product: await Product.findOrFail(params.id)
        })
    }

    async saveOrder({request, response}: HttpContext) {
        const data = request.only(['id', 'qty', 'vat', 'price', 'user'])

        const order = await Order.create({
            userId: data.user,
            totalAmount: ((data.price * data.qty) / 100 * (100 + data.vat)),
            status: 'pending',
        })

        const orderItems = await OrderProduct.create({
            orderId: order.id,
            productId: data.id,
            quantity: data.qty,
            price: data.price,
        })

        const product = await Product.findOrFail(data.id)
        await product.merge({ stock: (product.stock - data.qty) }).save()

        return response.json({
            success: true,
            data: orderItems
        })
    }

    async billing({ inertia, params }: HttpContext) {
        const orders = await Order.query().where('id', params.id).preload('orderProducts', (orderProducts) =>{
            orderProducts.preload('products')
        })

        return inertia.render("cashiers/walk-in-orders/billing", {
            orders: orders.map(order => ({
                id: order.id,
                totalAmount: order.totalAmount,
                status: order.status,
                orders: order.orderProducts.map(orderProduct => ({
                    quantity: orderProduct.quantity,
                    products: orderProduct.products
                }))
            })),
        })
    }

    async payment({ request, response }: HttpContext) {
        const data = request.body()
        const order = await Order.findOrFail(data.orderId)
        await order.merge({ status: data.status }).save()
        await Payment.create(data)
        return response.status(200).json({
            success: true,
            message: 'Payment Successfully!'
        })
    }

    //async updateProduct({}: HttpContext) {}


}