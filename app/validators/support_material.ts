import vine from '@vinejs/vine'
/** Esquema de validación para crear un material de soporte */
export const createSupportMaterialValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(100),
    level_id: vine
      .number()
      .positive()
      .exists(async (db, value) => {
        const result = await db.from('levels').where('id', value).first()
        return !!result
      }),
    description: vine.string().trim().minLength(5),
    link: vine.string().trim().url(),
  })
)

/** Esquema de validación para actualizar un material de soporte */
export const updateSupportMaterialValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(100).optional(),
    level_id: vine
      .number()
      .positive()
      .exists(async (database, value) => {
        const result = await database.from('levels').where('id', value).first()
        return !!result
      })
      .optional(),
    description: vine.string().trim().minLength(5).optional(),
    link: vine.string().trim().url().optional(),
  })
)
