import vine from '@vinejs/vine'

export const createClassroomValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(100),
    capacity: vine.number().positive().min(1),
    house_id: vine.number().positive().exists(async (db, value) => {
      const result = await db.from('houses').where('id', value).first()
      return !!result
    }),
  })
)

export const updateClassroomValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(100).optional(),
    capacity: vine.number().positive().min(1).optional(),
    house_id: vine.number().positive().exists(async (db, value) => {
      const result = await db.from('houses').where('id', value).first()
      return !!result
    }).optional(),
  })
)
