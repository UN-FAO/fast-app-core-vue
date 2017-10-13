const Dashboard = r =>
  require.ensure([], () => r(require('./views/dashboard')), 'offline-module')

const Survey = r =>
  require.ensure([], () => r(require('./views/newSurvey')), 'offline-module')

let DashboardRoutes = [
  { path: '/dashboard', component: Dashboard, name: 'dashboard', meta: { requiresAuth: true } },
  { path: '/survey', component: Survey, name: 'newSurvey', meta: { requiresAuth: true } }
]

export default DashboardRoutes
