import type { HttpContext } from '@adonisjs/core/http'
import Permission from '../Models/permission.js'
import Group from '../Models/group.js'

export default class PermissionsController {

    async getAll({ response }: HttpContext) {
        const permissions = await Permission.all()
        return response
            .status(200)
            .json({
                success: true,
                data:permissions
            })
    }

    async getById({ response, params }: HttpContext) {
        const group = await Group.findOrFail(params.id)

        const groupPermission = await group.related('permissions').query()

        const permissions: any[] = []

        groupPermission.map((permission) => permissions.push(`${permission.id}`))

        return response
        .status(200)
        .json({
            success: true,
            data: {
                permission: permissions
            }
        })
    }

    async updateGroupPermissions({ request, response, params }: HttpContext) {
        const group = await Group.findOrFail(params.id)
        const {permissions} = request.body()

        await group.related('permissions').sync(permissions)

        return response
            .status(200)
            .json({
                success: true,
                message: 'Permissions updated.'
            })
    }

}