import router from "@adonisjs/core/services/router";
import PagesController from "../Controllers/pages_controller.js";
import ProductsController from "../Controllers/products_controller.js";
import CategoriesController from "../Controllers/categories_controller.js";

const WebsitesRouter = () => {
    router.group(() => {
        router.get('/', [PagesController, 'index'])
        router.get('/form/:id?', [PagesController, 'form'])
        router.post('/store/:id?', [PagesController, 'store'])
        router.delete('/delete/:id', [PagesController, 'delete'])
    }).prefix('websites/pages')

    router.group(() => {
        router.get('/', [ProductsController, 'index'])
        router.get('/form/:id?', [ProductsController, 'form'])
        router.post('/store/:id?', [ProductsController, 'store'])
        router.delete('/delete/:id', [ProductsController, 'delete'])
    }).prefix('websites/products')

    router.group(() => {
        router.get('/', [CategoriesController, 'index'])
        //router.get('/form/:id?', [PagesController, 'form'])
        router.post('/store/:id?', [CategoriesController, 'store'])
        router.delete('/delete/:id', [CategoriesController, 'delete'])
    }).prefix('websites/categories')
}

export default WebsitesRouter