import vine from '@vinejs/vine'

export const updatePasswordValidator = vine.compile(
  vine.object({
    current_password: vine.string(),

    new_password: vine
      .string()
      .minLength(6)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])/, {
        name: 'password_strength',
      }),

    confirm_password: vine.string().sameAs('new_password'),
  })
)
