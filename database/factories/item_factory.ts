import factory from '@adonisjs/lucid/factories'
import Item from '#models/item'

export const ItemFactory = factory
  .define(Item, async ({ faker }) => {
    return {}
  })
  .build()