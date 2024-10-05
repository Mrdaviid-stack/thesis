import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import Category from './category.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import OrderProduct from './order_product.js'
import CartItem from './cart_item.js'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare sku: string

  @column()
  declare modelNumber: string

  @column()
  declare name: string

  @column()
  declare description: string

  @column()
  declare price: number

  @column()
  declare stock: number

  @column()
  declare color: string

  @column()
  declare storage: string

  @column()
  declare ram: string

  @column()
  declare categoryId: number

  @column()
  declare status: 'active' | 'draft'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Category)
  declare category: BelongsTo<typeof Category>

  @hasMany(() => OrderProduct)
  declare orderProduct: HasMany<typeof OrderProduct>

  @hasMany(() => CartItem)
  declare cartItems: HasMany<typeof CartItem>
}