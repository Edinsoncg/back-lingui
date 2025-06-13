import vine from '@vinejs/vine'

export const addStudentToClassValidator = vine.compile(
  vine.object({
    student_code: vine.string().trim(),
  })
)
