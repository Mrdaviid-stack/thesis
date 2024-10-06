import BaseController from '../../Core/Controllers/base_controller.js'
import type { HttpContext } from '@adonisjs/core/http'
import User from '../Models/user.js'
import Group from '../Models/group.js'
import stringHelpers from '@adonisjs/core/helpers/string'
import app from '@adonisjs/core/services/app'
import { cuid } from '@adonisjs/core/helpers'

export default class UsersController extends BaseController {

    constructor() {
        super({ model: User })
    }

    // render users page 
    async index({ inertia }: HttpContext) {
        return inertia.render('admin/users/users', {
            datatable: await User.query().select('*').whereNull('deleted_at')
        })
    }

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

    // Render form post and update
    async form({ inertia, params }: HttpContext) {
        const groups = await Group.all()
        const options = groups.map(group => ({ label: group.name, value: group.id }))
        if (params.id) {
            const records = await User.query().where('id', params.id).preload('groups')
            const test = await User.findOrFail(params.id)
            return inertia.render('admin/users/users_form', { 
                data: records.map((record) => ({
                    id: record.id,
                    firstname: record.firstname,
                    lastname: record.lastname,
                    email:  record.email,
                    image: record.image,
                    address: record.address,
                    group: record.groups[0].id
                })),
                records: test, 
                options 
            })
        }
        return inertia.render('admin/users/users_form', { options })
    }

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

    // Store and Update
    async store({ request, response, params }: HttpContext) {

        const data = request.body()
        const image = request.file('image')

        // UPDATE user if params id is present
        if (params.id) {
            //check if user exist
            const user = await User.findOrFail(params.id)

            // Store user image in public folder
            if(image) {
                const date = new Date()
                await image.move(app.makePath(`public/uploads/${date.getFullYear()}/${date.getDate()}/`), {
                    name: `${cuid()}.${image.extname}`
                })
            }

            
            // merge latest data to old data
            await user.merge({
                firstname: data.firstname,
                lastname: data.lastname,
                email: data.email,
                status: data.status,
                address: data.address,
                image: image?.filePath?.split('\\').slice(-4).join('\\')
            }).save()

            if (data.password) {
                await user.merge({password: data.password}).save()
            }

            // Sync user group.
            if (data.group) {
                user.related('groups').sync([parseInt(data.group)])
            }
            
            const user_details = await User.query().where('id', user.id).preload('groups')

            return response
                .status(201)
                .json({
                    success: true,
                    message: 'Successfully updated.',
                    data: JSON.stringify(user_details.map(user => ({
                        id: user.id,
                        firstname: user.firstname,
                        lastname: user.lastname,
                        email: user.email,
                        status: user.status,
                        address: user.address,
                        image: user.image,
                        group: user.groups[0].name
                    })))
                })
        }
        // Store new user
        
        // Store image to public folder.
        if (image) {
            const date = new Date()
            await image.move(app.makePath(`public/uploads/${date.getFullYear()}/${date.getDate()}/`), {
                name: `${cuid()}.${image.extname}`
            })
        }

        const password_combination = stringHelpers.noCase(data.firstname) + stringHelpers.noCase(data.lastname)

        // Save user information.
        const user = await User.create({
            firstname: data.firstname,
            lastname: data.lastname,
            email: data.email,
            status: data.status,
            password: password_combination,
            address: data.address,
            image: image?.filePath?.split('\\').slice(-4).join('\\')
        })

        // Save user group.
        await user.related('groups').sync([parseInt(data.group)])

        const user_details = await User.query().where('id', user.id).preload('groups')
        return response
            .status(200)
            .json({
                success: true,
                message: 'Successfully added.',
                data: JSON.stringify(user_details.map(user => ({
                    id: user.id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    status: user.status,
                    address: user.address,
                    image: user.image,
                    group: user.groups[0].name
                })))
            })
    }

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

    // update user status
    async updateUserStatus({ response, params }: HttpContext) {
        const user = await User.findOrFail(params.id)
        await user.merge({ status: !user.status }).save()
        return response
            .status(201)
            .json({
                success: true,
                message: `${user.username} status successfully updated.`,
            })
    }

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

    async userGroupPermissions({ response, auth }: HttpContext) {
        const user = await auth.authenticate()

        const userGroup = await user.related('groups').query()

        const userGroupPermissions = await userGroup[0].related('permissions').query()

        const abilities: string[] = []
   
        userGroupPermissions.map(permission => abilities.push(permission.name))

        return response.status(200).json({
            permissions: JSON.stringify(abilities),
        })
    }

    async delete({ response, params}: HttpContext) {
        const user = await User.findOrFail(params.id)
        await user.delete()
        return response
            .status(201)
            .json({
                success: true,
                message: `${user.username} successfully deleted.`,
            })
    }

}