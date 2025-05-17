/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import IniciosController from '#controllers/inicios_controller'
import router from '@adonisjs/core/services/router'
import DashboardController from '#controllers/dashboard_controller'
import { middleware } from '#start/kernel'
import AuthController from '#controllers/auth_controller'
import SupportMaterialsController from '#controllers/support_materials_controller'
import LevelsController from '#controllers/levels_controller'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.get('/dashboard', [DashboardController, 'index'])
  .use(middleware.auth({
    guards: ['api']
  })
)

//RUTAS SUPPORT MATERIAL

router.get('/support-material', [SupportMaterialsController, 'list'])
  .use(middleware.auth({
    guards: ['api']
  })
)

router.get('/support-material/:id', [SupportMaterialsController, 'get'])
  .use(middleware.auth({
    guards: ['api']
  })
)

router.post('/support-material', [SupportMaterialsController, 'create'])
  .use(middleware.auth({
    guards: ['api']
  })
)

router.patch('/support-material/:id', [SupportMaterialsController, 'update'])
  .use(middleware.auth({
    guards: ['api']
  })
)

router.delete('/support-material/:id', [SupportMaterialsController, 'destroy'])
  .use(middleware.auth({
    guards: ['api']
  })
)

router.post('login', [AuthController, 'login'])

//RUTA DE NIVELES
router.get('/levels', [LevelsController, 'index'])
  .use(middleware.auth({
    guards: ['api']
  })
)
