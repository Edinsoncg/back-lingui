// app/validators/house.ts
import vine from '@vinejs/vine'

export const createValidator = vine.compile(
  vine.object({
    name: vine
      .string()
      .trim()
      .minLength(1)
      .unique(async (db, value) => {
        const exists = await db.from('houses').where('name', value).first()
        return !exists
      }),
  })
)

export const updateValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1),
  })
)
