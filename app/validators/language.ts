import vine from '@vinejs/vine'

export const createLanguageValidator = vine.compile(
  vine.object({
    name: vine
      .string()
      .trim()
      .minLength(1)
      .maxLength(100)
      .unique({ table: 'languages', column: 'name' }),

    abbreviation: vine
      .string()
      .trim()
      .minLength(2)
      .maxLength(10)
      .unique({ table: 'languages', column: 'abbreviation' }),
  })
)

export const updateLanguageValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(100).optional(),
    abbreviation: vine.string().trim().minLength(2).maxLength(10).optional(),
  })
)
