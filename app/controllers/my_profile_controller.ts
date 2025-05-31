import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Application from '@adonisjs/core/services/app'

export default class ProfileController {
  public async list({ auth, request, response }: HttpContext) {
    await auth.check()

    const allowedQueryKeys = [] // No debe aceptar nada en este endpoint
    const queryKeys = Object.keys(request.qs())

    if (queryKeys.length > 0 && queryKeys.some(k => !allowedQueryKeys.includes(k))) {
      return response.badRequest({
        message: 'No se permiten parámetros en esta ruta',
      })
    }

    const user = await User.findOrFail(auth.user!.id)

    return response.ok({
      ...user.toJSON(),
      profilePictureUrl: user.profilePicture
        ? `${request.protocol()}://${request.hostname()}/${user.profilePicture}`
        : null,
    })
  }

  public async update({ auth, request, response }: HttpContext) {
    try {
      await auth.check()
      const user = await User.findOrFail(auth.user!.id)

      const data = request.only([
        'first_name',
        'middle_name',
        'first_last_name',
        'second_last_name',
        'email',
        'phone_number',
      ])

      const image = request.file('profile_picture', {
        size: '2mb',
        extnames: ['jpg', 'jpeg', 'png', 'webp'],
      })

      if (image) {
        const fileName = `${new Date().getTime()}.${image.extname}`
        await image.move(Application.publicPath('uploads/profile_pictures'), {
          name: fileName,
          overwrite: true,
        })
        user.profilePicture = `uploads/profile_pictures/${fileName}`
      }

      user.merge(data)
      await user.save()

      return response.ok({
        message: 'Perfil actualizado',
        user: {
          ...user.toJSON(),
          profilePictureUrl: user.profilePicture
            ? `${request.protocol()}://${request.hostname()}/${user.profilePicture}`
            : null,
        },
      })
    } catch (error) {
      console.error(error)
      return response.badRequest({ message: 'No se pudo actualizar el perfil' })
    }
  }
}
