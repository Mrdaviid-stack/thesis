import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, beforeSave, column, hasMany, hasOne, manyToMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { AccessToken, DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import Group from './group.js'
import type { HasMany, HasOne, ManyToMany } from '@adonisjs/lucid/types/relations'
import strignHelpers from '@adonisjs/core/helpers/string'
import Cart from '../../Websites/Models/cart.js'
import Order from '../../Websites/Models/order.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare firstname: string

  @column()
  declare lastname: string

  @column()
  declare username: string 

  @column()
  declare email: string

  @column()
  declare address: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare status: boolean

  @column()
  declare image: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @column.dateTime()
  declare deletedAt: DateTime | null

  @manyToMany(() => Group)
  declare groups: ManyToMany<typeof Group>

  @hasOne(() => Cart)
  declare cart: HasOne<typeof Cart>

  @hasMany(() => Order)
  declare orders: HasMany<typeof Order>

  currentAccessToken?: AccessToken

  static accessTokens = DbAccessTokensProvider.forModel(User, {
    expiresIn: '1h',
    prefix: 'oat_',
    table: 'auth_access_tokens',
    type: 'auth_token',
    tokenSecretLength: 10,
  })

  @beforeSave()
  static async beforeSave(user: User) {
    const userIdentity =  `${strignHelpers.noCase(user.firstname)}${strignHelpers.noCase(user.lastname)}`;
    user.username = userIdentity
    //user.password = await hash.make(userIdentity)
  }
}