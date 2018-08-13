const Login = (r) =>
  require.ensure([], () => r(require('./views/Login')), 'login-module');
const Register = (r) =>
  require.ensure([], () => r(require('./views/Register')), 'register-module');
const Reset = (r) =>
  require.ensure(
    [],
    () => r(require('./views/forgotPassword')),
    'register-module'
  );

let AuthRoutes = [
  {
    path: '/login',
    component: Login,
    name: 'login'
  },
  {
    path: '/register',
    component: Register,
    name: 'register'
  },
  {
    path: '/sendreset',
    component: Reset,
    name: 'sendreset'
  },
  {
    path: '/',
    redirect: '/login'
  }
];

export default AuthRoutes;
