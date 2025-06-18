import vine from '@vinejs/vine'

export const classroomSessionCreateSchema = vine.object({
  classroom_id: vine.number(),
  modality_id: vine.number(),
  unit_id: vine.number(),
  teacher_user_language_id: vine.number(),
  class_type_id: vine.number(),
  start_at: vine.date(),
  duration: vine.number().min(1).max(3),
})

export const classroomSessionUpdateSchema = vine.object({
  classroom_id: vine.number(),
  modality_id: vine.number().optional(),
  unit_id: vine.number().optional(),
  teacher_user_language_id: vine.number().optional(),
  class_type_id: vine.number().optional(),
  start_at: vine.date().optional(),
  duration: vine.number().min(1).max(3).optional(),
})
