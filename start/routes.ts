/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import DashboardController from '#controllers/dashboard_controller'
import { middleware } from '#start/kernel'
import AuthController from '#controllers/auth_controller'
import SupportMaterialsController from '#controllers/support_materials_controller'
import LevelsController from '#controllers/levels_controller'
import AgendaController from '#controllers/agenda_controller'
import ClassroomsController from '#controllers/classrooms_controller'
import DocumentTypeController from '#controllers/document_type_controller'
import WorkdayController from '#controllers/workday_controller'
import RoleController from '#controllers/role_controller'
import UserController from '#controllers/setting_user_controller'
import StudentAcademyProgressesController from '#controllers/student_academy_progresses_controller'
import StudentContractProgressesController from '#controllers/student_contract_progresses_controller'
import ContractsController from '#controllers/contracts_controller'
import StatusesController from '#controllers/statuses_controller'
import ReportStudentController from '#controllers/report_student_controller'

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

router.group(() => {
  router.get('/', [AgendaController, 'list'])
  router.get('/:id', [AgendaController, 'get'])
  router.post('/', [AgendaController, 'create'])
  router.put('/:id', [AgendaController, 'update'])
  router.delete('/:id', [AgendaController, 'destroy'])
}).prefix('/agenda')
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

//RUTA DE USER
router.group(() => {
  router.get('/', [UserController, 'list'])
  router.get('/:id', [UserController, 'get'])
  router.post('/', [UserController, 'create'])
  router.patch('/:id', [UserController, 'update'])
  router.delete('/:id', [UserController, 'destroy'])
}).prefix('/setting/user')
  .use(
    middleware.auth({
      guards: ['api'],
    })
  )

//RUTA DE Seguimiento Academico
router.group(() => {
  router.get('/', [StudentAcademyProgressesController, 'list'])
  router.post('/', [StudentAcademyProgressesController, 'complete'])
  router.delete('/', [StudentAcademyProgressesController, 'uncomplete'])
  router.post('/save', [StudentAcademyProgressesController, 'saveProgress'])
}).prefix('/progress/academic')
  .use(
    middleware.auth({
      guards: ['api'],
    })
  )

//RUTA DE Seguiemiento de Contratos
router.group(() => {
  router.get('/', [StudentContractProgressesController, 'list'])
  router.patch('/', [StudentContractProgressesController, 'update'])
}).prefix('/progress/contract')
  .use(
    middleware.auth({
      guards: ['api'],
    })
  )

//RUTA DE NIVELES
router.get('/levels', [LevelsController, 'index'])
  .use(middleware.auth({
    guards: ['api']
  })
)

//RUTA DE DOCUMENT_TYPE
router.get('/document-type', [DocumentTypeController, 'list'])
.use(middleware.auth({
  guards: ['api']
})
)

//RUTA DE WORKDAY
router.get('/workday', [WorkdayController, 'list'])
.use(middleware.auth({
  guards: ['api']
})
)

//RUTA DE ROLE
router.get('/role', [RoleController, 'list'])
.use(middleware.auth({
  guards: ['api']
})
)

//Ruta de Classroom
router.get('/classroom', [ClassroomsController, 'list'])
  .use(middleware.auth({
    guards: ['api']
  })
)

//RUTA DE Contract
router.get('/contract', [ContractsController, 'list'])
.use(middleware.auth({
  guards: ['api']
})
)

//RUTA DE Status
router.get('/status', [StatusesController, 'list'])
.use(middleware.auth({
  guards: ['api']
})
)

// Reportes de estudiantes
router.group(() => {
  router.get('/', [ReportStudentController, 'index'])
  router.get('/:code', [ReportStudentController, 'getByCode'])
}).prefix('/report/student')
  .use(middleware.auth({
    guards: ['api']
  }))
