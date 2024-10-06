import type { HttpContext } from '@adonisjs/core/http'
import Product from '../../Websites/Models/product.js'
import _ from 'lodash'
import Order from '../../Websites/Models/order.js'
import OrderProduct from '../../Websites/Models/order_product.js'
import Payment from '../../Websites/Models/payment.js'
import { nanoid } from 'nanoid'
import Transaction from '../../Websites/Models/transaction.js'

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

        console.log(data)

        const order = await Order.create({
            userId: data.user,
            totalAmount: data.price//((data.price * data.qty) / 100 * (100 + data.vat)),
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
                orders: order.orderProducts.map(orderProduct => ({
                    quantity: orderProduct.quantity,
                    products: orderProduct.products
                }))
            })),
        })
    }

    async payment({ request, response }: HttpContext) {
        const data = request.body()
        console.log(data)

        const order = await Order.findOrFail(data.orderId)
        await order.merge({ userId: data.userId }).save()

        const payment = await Payment.create({
            orderId: order.id,
            paymentMethod: data.paymentMethod,
            amount: data.amount,
            reference: !data.reference ? 'n/a' : data.reference,
        })

        await Transaction.create({
            invoice: `INV-${nanoid()}`,
            orderId: order.id,
            paymentId: payment.id,
            source: 'onsite',
            status: 'completed',
        })

        return response.status(200).json({
            success: true,
            message: 'Payment Successfully!'
        })
    }

    //async updateProduct({}: HttpContext) {}


}