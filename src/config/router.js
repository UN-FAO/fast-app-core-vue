import Vue from 'vue'
import VueRouter from 'vue-router'
import setRoutes from 'config/setRoutes'
import Auth from 'modules/Auth/api/Auth'
/**
 * Import routes from modules
 */
import AuthRoutes from 'modules/Auth/routes'
import DashboardRoutes from 'modules/Dashboard/routes'
import FormioRoutes from 'modules/Formio/routes'
import SettingsRoutes from 'modules/Settings/routes'

Vue.use(VueRouter)
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
let routes = setRoutes([AuthRoutes, DashboardRoutes, FormioRoutes, SettingsRoutes])

// Default 404
const Error404 = r =>
  require.ensure([], () => r(require('../modules/Auth/views/Error404')), 'offline-module')
routes.push({ path: '*', component: Error404, name: 'error404' })

const router = new VueRouter({
  /*
   * NOTE! VueRouter "history" mode DOESN'T works for Cordova builds,
   * it is only to be used only for websites.
   *
   * If you decide to go with "history" mode, please also open /config/index.js
   * and set "build.publicPath" to something other than an empty string.
   * Example: '/' instead of current ''
   *
   * If switching back to default "hash" mode, don't forget to set the
   * build publicPath back to '' so Cordova builds work again.
   */

  // mode: 'history',
  mode: 'hash',
  routes,
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})

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
  // If the route requires Auth
  if (to.meta.requiresAuth && Auth.user() === false) {
    next(false)
    router.push({ path: '/login' })
  } else if (Auth.user() && (to.name === 'login' || to.name === 'login_redirect')) {
    router.push({ name: 'dashboard' })
  } else {
    window.scrollTo(0, 0)
    next()
  }
})

export default router
