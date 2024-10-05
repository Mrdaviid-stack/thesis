// import type { HttpContext } from '@adonisjs/core/http'

import BaseController from "../../Core/Controllers/base_controller.js";
import Category from "../Models/category.js";

export default class CategoriesController extends BaseController {
    constructor() {
        super({
            model: Category,
            path: "websites/categories/categories"
        })
    }
}