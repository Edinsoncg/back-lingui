import vine from '@vinejs/vine'

export const createUserValidator = vine.compile(
  vine.object({
    first_name: vine.string().minLength(3).maxLength(32),
    middle_name: vine.string().nullable().optional(),
    first_last_name: vine.string().minLength(3).maxLength(32),
    second_last_name: vine.string().nullable(),

    document_type_id: vine.number().exists(async (db, value) => {
      return await db.from('document_types').where('id', value).first()
    }),

    document_number: vine.string().minLength(8).maxLength(10),
    email: vine.string().email(),
    password: vine.string().minLength(6),
    phone_number: vine.string().minLength(7).maxLength(15),

    role_ids: vine.array(
      vine.number().exists(async (db, value) => {
        return await db.from('roles').where('id', value).first()
      })
    ),

    // El campo workday_id es obligatorio para todos excepto estudiantes
    workday_id: vine
      .number()
      .exists(async (db, value) => {
        return await db.from('workdays').where('id', value).first()
      })
      .optional(),

    // Nota: language_ids solo aplica para profesores (role_id === 3)
    language_ids: vine
      .array(
        vine.number().exists(async (db, value) => {
          return await db.from('languages').where('id', value).first()
        })
      )
      .optional(),
  })
)

export const updateUserValidator = vine.compile(
  vine.object({
    first_name: vine.string().minLength(3).maxLength(32).optional(),
    middle_name: vine.string().nullable().optional(),
    first_last_name: vine.string().minLength(3).maxLength(32).optional(),
    second_last_name: vine.string().nullable().optional(),

    document_type_id: vine
      .number()
      .exists(async (db, value) => {
        return await db.from('document_types').where('id', value).first()
      })
      .optional(),

    document_number: vine.string().minLength(8).maxLength(10).optional(),
    email: vine.string().email().optional(),
    phone_number: vine.string().minLength(7).maxLength(15).optional(),

    role_ids: vine
      .array(
        vine.number().exists(async (db, value) => {
          return await db.from('roles').where('id', value).first()
        })
      )
      .optional(),

    workday_id: vine
      .number()
      .exists(async (db, value) => {
        return await db.from('workdays').where('id', value).first()
      })
      .optional(),

    language_ids: vine
      .array(
        vine.number().exists(async (db, value) => {
          return await db.from('languages').where('id', value).first()
        })
      )
      .optional(),
  })
)
