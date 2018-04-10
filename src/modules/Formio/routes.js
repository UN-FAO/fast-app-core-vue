const FormShow = r =>
  require.ensure([], () => r(require('./views/submissions/show')), 'offline-module')

const Submission = r =>
  require.ensure([], () => r(require('./views/submissions/create')), 'offline-module')

const Report = r =>
  require.ensure([], () => r(require('./views/submissions/report')), 'offline-module')

let FormioRoutes = [{
    path: '/formio/forms/:idForm',
    component: FormShow,
    name: 'formio_form_show',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/formio/forms/:idForm/submissions',
    component: Submission,
    name: 'formio_form_submission',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/formio/forms/:idForm/submissions/:idSubmission/update',
    component: Submission,
    name: 'formio_submission_update',
    meta: {
      requiresAuth: true
    }
  },
    {
    path: '/formio/forms/:idForm/submissions/:idSubmission/report',
    component: Report,
    name: 'formio_submission_report',
    meta: {
      requiresAuth: true
    }
  }
]

export default FormioRoutes
