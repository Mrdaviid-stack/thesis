import router from "@adonisjs/core/services/router";
import LandingsController from "../Controllers/landings_controller.js";
import ShopsController from "../Controllers/shops_controller.js";
import ProfilesController from "../Controllers/profiles_controller.js";
import AuthController from "../Controllers/auth_controller.js";

export default function FrontendRoute()  {
    router.get('/:slug?', [LandingsController, 'index'])

    router.get('/shops/product', [ShopsController, 'index'])

    router.get('/shops/product/:modelNumber/buy', [ShopsController, 'buynow'])
    router.post('/add-to-cart', [ShopsController, 'addToCart'])

    router.get('/shops/cart', [ShopsController, 'cart'])

    router.get('/cart-item/:id', [ShopsController, 'getUserCartItem'])

    router.delete('/cart-item/:itemId/:userId', [ShopsController, 'removeUserCartItem'])
    router.patch('/cart-item/:itemId/:userId/:action', [ShopsController, 'updateUserCartItem'])

    router.get('/shops/order', [ShopsController, 'order'])
    router.post('/placed-order', [ShopsController, 'placedOrder'])

    /////////////////////////////////////////////////////////
    router.get('/shops/profile', [ProfilesController, 'index'])
    router.get('/shops/profile/orders/:id', [ProfilesController, 'orders'])

    /////
    router.get('/auth/login', [AuthController, 'index'])
    router.get('/auth/register', [AuthController, 'register'])
}