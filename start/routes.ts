import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import AuthController from '#controllers/auth_controller'
import SupportMaterialsController from '#controllers/support_materials_controller'
import LevelsController from '#controllers/levels_controller'
import AgendaController from '#controllers/agendas_controller'
import ClassroomsController from '#controllers/classrooms_controller'
import DocumentTypeController from '#controllers/document_type_controller'
import WorkdayController from '#controllers/workday_controller'
import RoleController from '#controllers/role_controller'
import UserController from '#controllers/setting_user_controller'
import StudentAcademyProgressesController from '#controllers/student_academy_progresses_controller'
import StudentContractProgressesController from '#controllers/student_contract_progresses_controller'
import ContractsController from '#controllers/contracts_controller'
import StatusesController from '#controllers/statuses_controller'
import MyProfileController from '#controllers/my_profile_controller'
import MyProfilePasswordsController from '#controllers/my_profile_passwords_controller'
import ReportStudentController from '#controllers/report_student_controller'
import ReportClassroomController from '#controllers/report_classroom_controller'
import ReportTeacherController from '#controllers/report_teacher_controller'
import ForgotPasswordController from '#controllers/forgot_passwords_controller'
import ResetPasswordController from '#controllers/reset_passwords_controller'
import DashboardAdminController from '#controllers/dashboard_admin_controller'
import ReceptionistDashboardController from '#controllers/dashboard_receptionist_controller'
import DashboardTeacherController from '#controllers/dashboard_teacher_controller'
import DashboardStudentController from '#controllers/dashboard_student_controller'
import ClasstypesController from '#controllers/class_types_controller'
import UnitsController from '#controllers/units_controller'
import LanguagesController from '#controllers/languages_controller'
import TeachersController from '#controllers/teachers_controller'
import ModalitiesController from '#controllers/modalities_controller'
import StudentAttendanceController from '#controllers/student_attendances_controller'

//RUTAS AGENDA
router
  .group(() => {
    router.get('/', [AgendaController, 'list'])
    router.get('/:id', [AgendaController, 'get'])
    router.post('/', [AgendaController, 'create'])
    router.patch('/:id', [AgendaController, 'update'])
    router.delete('/:id', [AgendaController, 'destroy'])
  })
  .prefix('/agenda')
  .use(
    middleware.auth({
      guards: ['api'],
    })
  )

//RUTAS DE ESTUDIANTES EN AGENDA
router
  .group(() => {
    router.get('/:classroom_session_id', [StudentAttendanceController, 'getStudentsInClass'])
    router.post('/:classroom_session_id', [StudentAttendanceController, 'addStudentToClass'])
    router.delete('/:classroom_session_id/:student_id', [StudentAttendanceController, 'removeStudentFromClass'])
  })
  .prefix('/agenda/students')
  .use(
    middleware.auth({
      guards: ['api'],
    })
  )

//RUTAS SUPPORT MATERIAL
router
  .group(() => {
    router.get('/', [SupportMaterialsController, 'list'])
    router.get('/:id', [SupportMaterialsController, 'get'])
    router.post('/', [SupportMaterialsController, 'create'])
    router.patch('/:id', [SupportMaterialsController, 'update'])
    router.delete('/:id', [SupportMaterialsController, 'destroy'])
  })
  .prefix('/support-material')
  .use(
    middleware.auth({
      guards: ['api'],
    })
  )

//RUTA DE AUTH
router.post('login', [AuthController, 'login'])

//RUTA DE USER
router
  .group(() => {
    router.get('/', [UserController, 'list'])
    router.get('/:id', [UserController, 'get'])
    router.post('/', [UserController, 'create'])
    router.patch('/:id', [UserController, 'update'])
    router.delete('/:id', [UserController, 'destroy'])
  })
  .prefix('/setting/user')
  .use(
    middleware.auth({
      guards: ['api'],
    })
  )

//RUTA DE Seguimiento Academico
router
  .group(() => {
    router.get('/', [StudentAcademyProgressesController, 'list'])
    router.post('/', [StudentAcademyProgressesController, 'complete'])
    router.delete('/', [StudentAcademyProgressesController, 'uncomplete'])
    router.post('/save', [StudentAcademyProgressesController, 'saveProgress'])
  })
  .prefix('/progress/academic')
  .use(
    middleware.auth({
      guards: ['api'],
    })
  )

//RUTA DE Seguiemiento de Contratos
router
  .group(() => {
    router.get('/', [StudentContractProgressesController, 'list'])
    router.patch('/', [StudentContractProgressesController, 'update'])
  })
  .prefix('/progress/contract')
  .use(
    middleware.auth({
      guards: ['api'],
    })
  )

//RUTA DE USER PROFILE

router
  .group(() => {
    router.get('/', [MyProfileController, 'list'])
    router.patch('/', [MyProfileController, 'update'])
  })
  .prefix('/profile')
  .use(
    middleware.auth({
      guards: ['api'],
    })
  )

//RUTA DE USER PASSWORDS
router.patch('/profile/password', [MyProfilePasswordsController, 'update']).use(
  middleware.auth({
    guards: ['api'],
  })
)

//RUTA DE IDIOMAS
router.get('/language', [LanguagesController, 'index']).use(
  middleware.auth({
    guards: ['api'],
  })
)

//RUTA DE NIVELES
router.get('/levels', [LevelsController, 'index']).use(
  middleware.auth({
    guards: ['api'],
  })
)

//RUTA DE UNIDADES
router.get('/unit', [UnitsController, 'index']).use(
  middleware.auth({
    guards: ['api'],
  })
)

//RUTA DE DOCUMENT_TYPE
router.get('/document-type', [DocumentTypeController, 'list']).use(
  middleware.auth({
    guards: ['api'],
  })
)

//RUTA DE WORKDAY
router.get('/workday', [WorkdayController, 'list']).use(
  middleware.auth({
    guards: ['api'],
  })
)

//RUTA DE ROLE
router.get('/role', [RoleController, 'list']).use(
  middleware.auth({
    guards: ['api'],
  })
)

//Ruta de Classroom
router.get('/classroom', [ClassroomsController, 'list']).use(
  middleware.auth({
    guards: ['api'],
  })
)

//RUTA DE Contract
router.get('/contract', [ContractsController, 'list']).use(
  middleware.auth({
    guards: ['api'],
  })
)

//RUTA DE Status
router.get('/status', [StatusesController, 'list']).use(
  middleware.auth({
    guards: ['api'],
  })
)

//RUTA DE Status
router.get('/teacher', [TeachersController, 'list']).use(
  middleware.auth({
    guards: ['api'],
  })
)

//RUTA DE Modalities
router.get('/modality', [ModalitiesController, 'list']).use(
  middleware.auth({
    guards: ['api'],
  })
)

// Reportes de estudiantes
router
  .group(() => {
    router.get('/', [ReportStudentController, 'index'])
    router.get('/:code', [ReportStudentController, 'show'])
  })
  .prefix('/report/student')
  .use(
    middleware.auth({
      guards: ['api'],
    })
  )

// Reportes de salones
router
  .group(() => {
    router.get('/', [ReportClassroomController, 'index'])
    router.get('/:id', [ReportClassroomController, 'show'])
  })
  .prefix('/report/classroom')
  .use(
    middleware.auth({
      guards: ['api'],
    })
  )

// Reportes de profesores
router
  .group(() => {
    router.get('/', [ReportTeacherController, 'index'])
    router.get('/:id', [ReportTeacherController, 'show'])
  })
  .prefix('/report/teacher')
  .use(
    middleware.auth({
      guards: ['api'],
    })
  )

router.post('/forgot-password', [ForgotPasswordController, 'send'])
router.post('/reset-password', [ResetPasswordController, 'handle'])

// Dashboard Admin
router
  .group(() => {
    router.get('/', [DashboardAdminController, 'index'])
  })
  .prefix('/dashboard/admin')
  .use(
    middleware.auth({
      guards: ['api'],
    })
  )

// Dashboard Receptionist
router
  .group(() => {
    router.get('/', [ReceptionistDashboardController, 'index'])
  })
  .prefix('/dashboard/receptionist')
  .use(middleware.auth({ guards: ['api'] }))

// Dashboard Teacher
router
  .group(() => {
    router.get('/', [DashboardTeacherController, 'index'])
  })
  .prefix('/dashboard/teacher')
  .use(middleware.auth({ guards: ['api'] }))

// Dashboard Student
router
  .group(() => {
    router.get('/', [DashboardStudentController, 'index'])
  })
  .prefix('/dashboard/student')
  .use(middleware.auth({ guards: ['api'] }))

//RUTA DE CLASSTYPES
router.get('/classtypes', [ClasstypesController, 'index']).use(
  middleware.auth({
    guards: ['api'],
  })
)
