import BaseController from '../../Core/Controllers/base_controller.js';
import type { HttpContext } from '@adonisjs/core/http'

import Product from "../Models/product.js";
import Category from '../Models/category.js';
import app from '@adonisjs/core/services/app';
import { cuid } from '@adonisjs/core/helpers';

export default class ProductsController extends BaseController {

    constructor() {
        super({
            model: Product,
            path: "websites/products/products"
        })
    }

    async index({ inertia }: HttpContext) {
        return inertia.render("websites/products/products", {
            datatable: await Product.all()
        })
    }

    async form({ inertia, params }: HttpContext) {
        const categories = await Category.all()
        if (params.id) {
            return inertia.render("websites/products/products_form", {
                record: await Product.findOrFail(params.id),
                categories: categories.map((category) => ({ value: category.id, label: category.name }))
            })
        }
        return inertia.render("websites/products/products_form", {
            record: {},
            categories: categories.map((category) => ({ value: category.id, label: category.name }))
        })
    }

    async store({ request, response, params }: HttpContext) {
        let data = request.body()
        const file = request.file('imageUrl')

        if (file) { 
            const date = new Date()
            await file!.move(app.makePath(`public/uploads/${date.getFullYear()}/${date.getDate()}/`), {
                name: `${cuid()}.${file!.extname}`
            })
            data['imageUrl'] = file?.filePath!.split('\\').slice(-4).join('\\')    
        } 
        
        if (params.id) {
            const record = await Product.findOrFail(params.id)
            await record.merge(data).save()
            return response.status(201).json({
                success: true,
                message: `successfully updated.`,
            })
        }

        const record = await Product.create(data)
        return response.status(200).json({
            success: true,
            message: `successfully added.`,
            data: record
        })
    }


}