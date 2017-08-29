const Dashboard = r =>
  require.ensure([], () => r(require('./views/dashboard')), 'offline-module')

let DashboardRoutes = [
  { path: '/dashboard', component: Dashboard, name: 'dashboard', meta: { requiresAuth: true } }
]

export default DashboardRoutes
