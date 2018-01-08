const Dashboard = r =>
  require.ensure([], () => r(require('./views/dashboard')), 'offline-module')

const Survey = r =>
  require.ensure([], () => r(require('./views/newSurvey')), 'offline-module')

  const CollectedData = r =>
  require.ensure([], () => r(require('./views/collectedData')), 'offline-module')

let DashboardRoutes = [
  { path: '/dashboard', component: Dashboard, name: 'dashboard', meta: { requiresAuth: true } },
  { path: '/survey', component: Survey, name: 'newSurvey', meta: { requiresAuth: true } },
  { path: '/collectedData', component: CollectedData, name: 'CollectedData', meta: { requiresAuth: true } }
]

export default DashboardRoutes
