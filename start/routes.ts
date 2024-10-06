/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import AuthRouter from '../app/Modules/Auth/Routes/routes.js'
import AdminRouter from '../app/Modules/Admin/Routes/routes.js'
import WebsitesRouter from '../app/Modules/Websites/Routes/routes.js'
import HomeController from '../app/Modules/Core/Controllers/home_controller.js'
import FilesRouter from '../app/Modules/Files/Routes/routes.js'
import CashiersRouter from '../app/Modules/Cashiers/Routes/routes.js'
import FrontendRoute from '../app/Modules/Frontend/Routes/routes.js'
import LandingsController from '../app/Modules/Frontend/Controllers/landings_controller.js'
import ReportsRoute from '../app/Modules/Reports/Routes/routes.js'

router.get('/', [LandingsController, 'index'])

router.group(() => {
    FrontendRoute()
}).prefix('shop')

router.group(() => {
    router.get('/', [HomeController, 'home'])
    AuthRouter()
    AdminRouter()
    WebsitesRouter()
    FilesRouter()
    CashiersRouter()
    ReportsRoute()
}).prefix('dashboard')


