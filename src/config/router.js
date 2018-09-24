import Vue from 'vue';
import VueRouter from 'vue-router';
import setRoutes from 'config/setRoutes';
import { Auth } from 'fast-fastjs';
import { Loading, QSpinnerAudio } from 'quasar';
/**
 * Import routes from modules
 */
import AuthRoutes from 'modules/Auth/routes';
import DashboardRoutes from 'modules/Dashboard/routes';
import PageManegerRoutes from 'modules/Pagemanager/routes';
import FormioRoutes from 'modules/Formio/routes';
import SettingsRoutes from 'modules/Settings/routes';

Vue.use(VueRouter);
/*
 |--------------------------------------------------------------------------
 | Mount Modules Routes
 |--------------------------------------------------------------------------
 |
 | Mount all routes from the modules
 |
 | You can manually define routes by assigning them to the
 | routes variable
 |
 |   routes.push({path: '/somePath', component: someComponent, name: 'someName'})
 |
 */
let routes = setRoutes([
  AuthRoutes,
  DashboardRoutes,
  PageManegerRoutes,
  FormioRoutes,
  SettingsRoutes
]);

// Default 404
const Error404 = (r) =>
  require.ensure(
    [],
    () => r(require('../modules/Auth/views/Error404')),
    'offline-module'
  );
routes.push({ path: '*', component: Error404, name: 'error404' });

const router = new VueRouter({
  mode: 'hash',
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 };
  }
});

/*
 |--------------------------------------------------------------------------
 | Secure Routes
 |--------------------------------------------------------------------------
 |
 | Makes sure that the User is loged in before allowing him
 | access to the protected routes.
 | Secure route example:
 |   {path: '/', component: someComponent, name: 'someName', meta: { requiresAuth: true }}
 |
 */

router.beforeEach((to, from, next) => {
  Loading.show({
    delay: 200,
    spinner: QSpinnerAudio,
    message: 'Loading...',
    messageColor: 'white',
    spinnerSize: 100,
    spinnerColor: 'white'
  });
  // If the route requires Auth
  if (to.meta.requiresAuth && Auth.user() === false) {
    next(false);
    router.push({ name: 'login' });
  } else if (Auth.user() && !to.meta.requiresAuth) {
    router.push({ name: 'dashboard' });
  } else {
    window.scrollTo(0, 0);
    next();
  }
});

router.afterEach(() => {
  Loading.hide();
});

export default router;
