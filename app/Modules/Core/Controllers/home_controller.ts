import type { HttpContext } from '@adonisjs/core/http'

export default class HomeController {

    async home({ inertia }:HttpContext) {
        inertia.share(
            {
                users: 6,
                pages: 10,
                version: 6,
            }
        )
        return inertia.render('home')
    }

}