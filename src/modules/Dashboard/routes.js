const Dashboard = (r) =>
  require.ensure([], () => r(require('./views/dashboard')), 'offline-module');

const Survey = (r) =>
  require.ensure([], () => r(require('./views/newSurvey')), 'offline-module');

const CollectedData = (r) =>
  require.ensure(
    [],
    () => r(require('./views/collectedData')),
    'offline-module'
  );

const About = (r) =>
  require.ensure([], () => r(require('./views/about')), 'offline-module');

const PageManeger = (r) =>
  require.ensure([], () => r(require('./views/pageManager')), 'offline-module');

let DashboardRoutes = [
  {
    path: '/dashboard',
    component: Dashboard,
    name: 'dashboard',
    meta: { requiresAuth: true }
  },
  {
    path: '/survey',
    component: Survey,
    name: 'newSurvey',
    meta: { requiresAuth: true }
  },
  {
    path: '/collectedData',
    component: CollectedData,
    name: 'CollectedData',
    meta: { requiresAuth: true }
  },
  {
    path: '/about',
    component: About,
    name: 'About',
    meta: { requiresAuth: true }
  },
  {
    path: '/pageManager/pageId/:pageId',
    component: PageManeger,
    name: 'pageManager',
    meta: { requiresAuth: true }
  }
];

export default DashboardRoutes;
