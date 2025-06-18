import vine from '@vinejs/vine'

export const authLoginValidator = vine.compile(
  vine.object({
    email: vine.string().email(),

    password: vine
      .string()
      .minLength(6)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])/, {
        name: 'secure_password',
      }),
  })
)
