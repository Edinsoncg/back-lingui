import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Application from '@adonisjs/core/services/app'
import { profileValidator } from '#validators/profile'

export default class ProfileController {
  public async list({ auth, request, response }: HttpContext) {
    await auth.check()

    const allowedQueryKeys = [] // No debe aceptar nada en este endpoint
    const queryKeys = Object.keys(request.qs())

    if (queryKeys.length > 0 && queryKeys.some((key) => !allowedQueryKeys.includes(key))) {
      return response.badRequest({
        message: 'No se permiten parámetros en esta ruta',
      })
    }

    const user = await User.findOrFail(auth.user!.id)

    return response.ok(user)
  }

  public async update({ auth, request, response }: HttpContext) {
    try {
      await auth.check()
      const user = await User.findOrFail(auth.user!.id)

      const data = await request.validateUsing(profileValidator)

      user.merge(data)

      const image = request.file('profile_picture', {
        size: '5mb',
        extnames: ['jpg', 'jpeg', 'png', 'webp'],
      })

      if (image && image.isValid) {
        const fileName = `${Date.now()}.${image.extname}`
        await image.move(Application.publicPath('uploads/profile_pictures'), {
          name: fileName,
          overwrite: true,
        })
        user.profile_picture = `uploads/profile_pictures/${fileName}`
      }

      await user.save()

      return response.ok({
        message: 'Perfil actualizado',
        user: user,
      })
    } catch (error) {
      console.error(error)
      return response.badRequest({ message: 'No se pudo actualizar el perfil' })
    }
  }
}
