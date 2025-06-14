import vine from '@vinejs/vine'

export const createStatusValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(50),
  })
)

export const updateStatusValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(50).optional(),
  })
)
