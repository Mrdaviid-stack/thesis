import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Order from './order.js';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';
import Payment from './payment.js';

export default class Transaction extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare invoice: string;

  @column()
  declare orderId: number;

  @column()
  declare paymentId: number;

  @column()
  declare source: 'onsite' | 'online';

  @column()
  declare status: 'pending' | 'order-placed' | 'out-for-delivery' | 'oder-received' | 'delivered' | 'completed';

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Order)
  declare order: BelongsTo<typeof Order>

  @belongsTo(() => Payment)
  declare payment: BelongsTo<typeof Payment>
}