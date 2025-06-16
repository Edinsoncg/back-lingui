import vine from '@vinejs/vine'

export const studentExtendedValidator = vine.compile(
  vine.object({
    student_code: vine.string().trim().minLength(2),

    status_id: vine
      .number()
      .positive()
      .exists(async (db, value) => {
        const exists = await db.from('status').where('id', value).first()
        return !!exists
      }),

    unit_id: vine
      .number()
      .positive()
      .exists(async (db, value) => {
        const exists = await db.from('units').where('id', value).first()
        return !!exists
      }),

    contract_id: vine
      .number()
      .positive()
      .exists(async (db, value) => {
        const exists = await db.from('contracts').where('id', value).first()
        return !!exists
      }),

    start_date: vine.date(), // validará que sea una fecha válida

    language_id: vine
      .number()
      .positive()
      .exists(async (db, value) => {
        return await db.from('languages').where('id', value).first()
      }),
  })
)
