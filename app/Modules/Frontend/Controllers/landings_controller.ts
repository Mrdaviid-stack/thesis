import type { HttpContext } from '@adonisjs/core/http'
import Page from '../../Websites/Models/page.js'

export default class LandingsController {
    async index({inertia, params}: HttpContext) {

        if (params.slug) {
            const page = await Page.query().select('*').where('slug', params.slug).first()
            return inertia.render('Frontend/slug', { page })
        } 
        return inertia.render('Frontend/landing')
    }


}