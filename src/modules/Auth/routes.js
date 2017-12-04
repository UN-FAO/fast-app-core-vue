const Login = r => require.ensure([], () => r(require('./views/Login')), 'offline-module')
const Register = r => require.ensure([], () => r(require('./views/Register')), 'offline-module')
const adminLogin = r => require.ensure([], () => r(require('./views/adminLogin')), 'offline-module')

let AuthRoutes = [{
    path: '/login',
    component: Login,
    name: 'login'
  },
  {
    path: '/adminLogin',
    component: adminLogin,
    name: 'adminLogin'
  },
  {
    path: '/register',
    component: Register,
    name: 'register'
  },
  {
    path: '/',
    component: Login,
    name: 'login_redirect'
  }
]

export default AuthRoutes
