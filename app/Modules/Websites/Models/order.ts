import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany, hasOne } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import OrderProduct from './order_product.js'
import Transaction from './transaction.js'
import Payment from './payment.js'
import User from '../../Admin/Models/user.js'

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare totalAmount: number

  @column()
  declare status: 'pending' | 'preparing' | 'in-transit' | 'completed'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => OrderProduct)
  declare orderProducts: HasMany<typeof OrderProduct>

  @hasOne(() => Transaction)
  declare transaction: HasOne<typeof Transaction>

  @belongsTo(() => Payment)
  declare payment: BelongsTo<typeof Payment>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

}