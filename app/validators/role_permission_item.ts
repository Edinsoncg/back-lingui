import vine from '@vinejs/vine'

export const assignPermissionsValidator = vine.compile(
  vine.object({
    role_id: vine.number().exists(async (db, value) => {
      return await db.from('roles').where('id', value).first()
    }),

    item_id: vine.number().exists(async (db, value) => {
      return await db.from('items').where('id', value).first()
    }),

    permission_item_ids: vine
      .array(
        vine.number().exists(async (db, value) => {
          return await db.from('permission_items').where('id', value).first()
        })
      )
      .minLength(1),
  })
)

export const removePermissionsValidator = vine.compile(
  vine.object({
    role_id: vine.number().exists(async (db, value) => {
      return await db.from('roles').where('id', value).first()
    }),

    item_id: vine.number().exists(async (db, value) => {
      return await db.from('items').where('id', value).first()
    }),

    permission_item_ids: vine
      .array(
        vine.number().exists(async (db, value) => {
          return await db.from('permission_items').where('id', value).first()
        })
      )
      .minLength(1),
  })
)

export const updatePermissionsValidator = vine.compile(
  vine.object({
    role_id: vine.number().exists(async (db, value) => {
      return await db.from('roles').where('id', value).first()
    }),

    item_id: vine.number().exists(async (db, value) => {
      return await db.from('items').where('id', value).first()
    }),

    permission_item_ids: vine
      .array(
        vine.number().exists(async (db, value) => {
          return await db.from('permission_items').where('id', value).first()
        })
      )
      .minLength(1),
  })
)
