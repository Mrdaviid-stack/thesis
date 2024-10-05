import type { HttpContext } from '@adonisjs/core/http'
import Page from '../Models/page.js'

export default class PagesController {

    async index({ inertia }: HttpContext) {
        const pages = await Page.query().select('*').whereNull('deleted_at')
        console.log(pages)
        return inertia.render('websites/pages/pages', {
            datatable: pages
        })
    }

    async form({ inertia, params }: HttpContext) {
        return inertia.render('websites/pages/pages_form', {
            data: params.id ? await Page.findOrFail(params.id) : []
        })
    }

    async store({request, response, params}: HttpContext) {
        const data = request.body()

        if (params.id) {
            const page = await Page.findOrFail(params.id)
            await page.merge(data).save()
            return response.status(201).json({
                success: true,
                message: `${page.name} successfully updated.`,
            })
        }

        const page = await Page.create(data)
        return response.status(200).json({
            success: true,
            message: `${page.name} successfully added.`,
            data: page
        })
    }

    async delete({ response, params}: HttpContext) {
        const page = await Page.findOrFail(params.id)
        await page.delete()
        return response
            .status(201)
            .json({
                success: true,
                message: 'Successfully deleted.',
            })
    }

}