import type { HttpContext } from '@adonisjs/core/http'
import { loginValidation } from '../Validations/auth.js'
import User from '../../Admin/Models/user.js'
import Permission from '../../Admin/Models/permission.js'

export default class AuthController {
  
    async index({ inertia }: HttpContext) {
        return inertia.render('auth/login')
    }

    async login({ request, response, auth }: HttpContext) {
        // validate user
        const { identity, password } = await request.validateUsing(loginValidation)
        // verfify user
        const user = await User.verifyCredentials(identity, password)
        // get user group
        const group = await user.related('groups').query()
        // get permission base on user group
        const permissions = await group[0].related('permissions').query()
        // array of user group permissions
        const abilities: string[] = []
        // map and store to array of permission
        permissions.map(permission => abilities.push(permission.name))
        // generate token with abilities
        const token = await auth.use('api').authenticateAsClient(user, abilities, {
            name: user.username,
            expiresIn: '1h',
        })

        const userDetails = await User.query().where('id', user.id).preload('groups')

        return response.status(200).json({
            type: 'bearer',
            token,
            allAbilities:  JSON.stringify(await Permission.all()),
            user: JSON.stringify(userDetails)
        })

    }

    async logout({ response, auth }: HttpContext) {
        const user = await auth.authenticate()
        await User.accessTokens.delete(user, user.currentAccessToken.identifier)
        return response.status(200).send('logout')
    }
  
}