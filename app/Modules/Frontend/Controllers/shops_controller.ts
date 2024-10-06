import type { HttpContext } from '@adonisjs/core/http'
import Product from '../../Websites/Models/product.js'
import Category from '../../Websites/Models/category.js'
import _ from 'lodash'
import Cart from '../../Websites/Models/cart.js'
import CartItem from '../../Websites/Models/cart_item.js'
import Order from '../../Websites/Models/order.js'
import OrderProduct from '../../Websites/Models/order_product.js'
import Payment from '../../Websites/Models/payment.js'
import Transaction from '../../Websites/Models/transaction.js'

import mail from '@adonisjs/mail/services/main'
import {nanoid} from 'nanoid'

export default class ShopsController {
    async index({ inertia }: HttpContext) {
        const products = await Product.query().where('status', 'active').preload('category')
        const categories = await Category.all()
        return inertia.render('Frontend/products/products', {
            products: _.groupBy(products, 'modelNumber'),
            categories: categories
        })
    }

    async buynow({inertia, params}: HttpContext) {
        const product = await Product.query().where('modelNumber', params.modelNumber).preload('category')
        return inertia.render('Frontend/products/buy-now', { product:product })
    }

    async addToCart({ request, response }: HttpContext) {
        const data = request.body()

        const userCart = await Cart.firstOrCreate(
            {userId: data.user},
            {userId: data.user},
        )

        const userCartItem = await CartItem.create({
            cartId: userCart.id,
            productId: data.id,
            quantity: data.qty,
        })
        
        return response.status(200).json({
            success: true,
            data:userCartItem
        })
    }
    
    async cart({ inertia }: HttpContext) {
        return inertia.render('Frontend/products/cart')
    }

    async getUserCartItem({ response, params }: HttpContext) {
        const cartItem = await Cart.query().where('userId', params.id).preload('cartItems', (cartItem) => cartItem.preload('product'))
        return response.status(200).json({
            success: true,
            cartItem
        })
    }

    async removeUserCartItem({ response, params }: HttpContext) {
        const userCart = await Cart.findByOrFail('userId', params.userId)
        await CartItem.query().where('cartId', userCart.id).andWhere('productId', params.itemId).delete()
        return response.status(200).json({
            success: true,
        })
    }

    async updateUserCartItem({ response,params }: HttpContext) {
        const userCart = await Cart.findByOrFail('userId', params.userId)
        const cartItem = await CartItem.query()
            .where('cartId', userCart.id)
            .andWhere('productId', params.itemId)
            .first()
        let action = params.action == 1 ? 
            {quantity: cartItem!.quantity + 1}
            : {quantity: cartItem!.quantity - 1}
        await cartItem?.merge(action).save()
        return response.status(200).json({
            success: true,
        })
    }

    async order({ inertia }: HttpContext) {
        return inertia.render('Frontend/products/order')
    }

    async placedOrder({ request, response }: HttpContext) {
      
        const data = request.body()

        const userOrder = await Order.create({
            userId: data.cart[0].user,
            totalAmount: data.totalAmount,
            //status: 'pending',
        })


        data.cart.map(async (crt:any) => {
            await OrderProduct.create({
                orderId: userOrder.id,
                productId: crt.id,
                quantity: crt.qty,
                price: crt.price
            })

            await CartItem.query().where('productId', crt.id).delete()
            const product = await Product.findOrFail(crt.id)
            await product.merge({ stock: product.stock - crt.qty }).save()
        })

        const payment = await Payment.create({
            orderId: userOrder.id,
            paymentMethod: data.paymentMethod,
            amount: data.downpayment,
            reference: data.reference,
        })

        const transaction = await Transaction.create({
            invoice: `INV-${nanoid()}`,
            orderId: userOrder.id,
            paymentId: payment.id,
            source: 'online',
            status: 'pending',
        })

        await mail.send((message) => {
            message
               .to(data.alternativeUserInfo.email ===null ? data.user.email : data.alternativeUserInfo.email)
               .from('admin@yourdomain.com')
               .subject(`${transaction.invoice}`)
               .htmlView('emails/order-confirmation', {
                    products: data.cart,
                    totalAmount: data.totalAmount,
                    downpayment: data.downpayment,
                    reference: data.reference,
                })
        })

        return response.status(200).json({
            success: true,
        })

    }
}