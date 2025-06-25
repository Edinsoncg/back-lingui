// app/validators/status.ts
import vine from '@vinejs/vine'

export const createValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1),
  })
)

export const updateValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1),
  })
)
