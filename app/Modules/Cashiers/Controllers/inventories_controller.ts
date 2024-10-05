//import BaseController from "../../Core/Controllers/base_controller.js";
import type { HttpContext } from '@adonisjs/core/http'
import Product from "../../Websites/Models/product.js";

export default class InventoriesController {

    async index({inertia}: HttpContext) {
        const products = await Product.all()
        return inertia.render("cashiers/inventories/inventories", {
            datatable: products
        })
    }
}