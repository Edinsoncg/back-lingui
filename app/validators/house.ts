import vine from '@vinejs/vine'

export const createHouseValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(3),
  })
)

export const updateHouseValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(3).optional(),
  })
)
