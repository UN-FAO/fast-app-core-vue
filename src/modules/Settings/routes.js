const Translations = (r) =>
  require.ensure(
    [],
    () => r(require('./components/translations')),
    'translations-module'
  );

const Reviewer = (r) =>
  require.ensure(
    [],
    () => r(require('./components/assignReviewer')),
    'reviewer-module'
  );

const AllData = (r) =>
  require.ensure(
    [],
    () => r(require('./components/allData')),
    'alldata-module'
  );

let SettingsRoutes = [
  {
    path: '/settings/translations',
    name: 'translations',
    component: Translations,
    meta: { requiresAuth: true }
  },
  {
    path: '/settings/reviewers',
    name: 'reviewers',
    component: Reviewer,
    meta: { requiresAuth: true }
  },
  {
    path: '/settings/alldata',
    name: 'alldata',
    component: AllData,
    meta: { requiresAuth: true }
  }
];

export default SettingsRoutes;
