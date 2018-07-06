const FormShow = (r) =>
  require.ensure(
    [],
    () => r(require('./views/submissions/show')),
    'submission-module'
  );

const Submission = (r) =>
  require.ensure(
    [],
    () => r(require('./views/submissions/create')),
    'submission-module'
  );

const Report = (r) =>
  require.ensure(
    [],
    () => r(require('./views/submissions/report')),
    'report-module'
  );

let FormioRoutes = [
  {
    path: '/forms/:idForm*/submission',
    component: Submission,
    name: 'formio_form_submission',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/forms/:idForm*/submission/:idSubmission/update',
    component: Submission,
    name: 'formio_submission_update',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/forms/:idForm*/submission/:idSubmission/report',
    component: Report,
    name: 'formio_submission_report',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/forms/:idForm*',
    component: FormShow,
    name: 'formio_form_show',
    meta: {
      requiresAuth: true
    }
  }
];

export default FormioRoutes;
