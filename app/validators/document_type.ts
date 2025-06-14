import vine from '@vinejs/vine'

export const createDocumentTypeValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(100),
    abbreviation: vine.string().trim().minLength(1).maxLength(10),
  })
)

export const updateDocumentTypeValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(100).optional(),
    abbreviation: vine.string().trim().minLength(1).maxLength(10).optional(),
  })
)
