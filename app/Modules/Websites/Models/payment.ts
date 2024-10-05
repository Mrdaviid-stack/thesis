import { DateTime } from 'luxon'
import { BaseModel, column, hasOne } from '@adonisjs/lucid/orm'
import Transaction from './transaction.js'
import type { HasOne } from '@adonisjs/lucid/types/relations'
import Order from './order.js'

export default class Payment extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare orderId: number

  @column()
  declare paymentMethod: 'credit_card'|'paypal'|'cod'|'gcash'|'paymaya'

  @column()
  declare amount: number

  @column()
  declare reference: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasOne(() => Transaction)
  declare tranaction: HasOne<typeof Transaction>

  @hasOne(() => Order)
  declare order: HasOne<typeof Order>
}