import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column } from '@adonisjs/lucid/orm'
import stringHelpers from '@adonisjs/core/helpers/string'

export default class Page extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare shortName: string

  @column()
  declare slug: string

  @column()
  declare content: string

  @column()
  declare status: 'Draft' | 'Published'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @column.dateTime()
  declare deletedAt: DateTime | null

  @beforeSave()
  static async beforesave(page: Page) {
    page.slug = stringHelpers.slug(page.name, { lower: true })
  }
}