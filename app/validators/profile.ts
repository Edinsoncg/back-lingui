import vine from '@vinejs/vine'

export const profileValidator = vine.compile(
  vine.object({
    first_name: vine.string().minLength(3).maxLength(10),
    middle_name: vine.string().minLength(3).maxLength(10).optional().nullable(),
    first_last_name: vine.string().minLength(3).maxLength(10),
    second_last_name: vine.string().minLength(3).maxLength(10),
    email: vine.string().email(),
    phone_number: vine.string().regex(/^\d{10}$/),
  })
)
