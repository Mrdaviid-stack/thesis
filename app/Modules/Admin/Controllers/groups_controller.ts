import type { HttpContext } from '@adonisjs/core/http'
import Group from '../Models/group.js'
import Permission from '../Models/permission.js'

export default class GroupsController {

    async index({ inertia }: HttpContext) {
        const datatable = await Group.query().select('*').whereNull('deleted_at')
        const permissions = await Permission.all()
        return inertia.render('admin/groups/groups', { datatable, permissions })
    }

    async store({ request, response, params }: HttpContext) {

        if (params.id) {
            const group = await Group.findOrFail(params.id)
            await group.merge(request.body()).save()
            return response
                .status(201)
                .json({
                    success: true,
                    message: 'Successfully updated.'
                })
        }

        const group = await Group.create(request.body())
        return response
            .status(200)
            .json({
                success: true,
                message: 'Successfully added.',
                data: group
            })
    }

    async delete({ response, params}: HttpContext) {
        const group = await Group.findOrFail(params.id)
        await group.delete()
        return response
            .status(201)
            .json({
                success: true,
                message: 'Successfully deleted.',
            })
    }

}