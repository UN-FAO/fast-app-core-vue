const Settings = r =>
  require.ensure([], () => r(require('./views/settings')), 'offline-module')

const Translations = r =>
  require.ensure([], () => r(require('./components/translations')), 'offline-module')

let SettingsRoutes = [{
  path: '/settings',
  component: Settings,
  name: 'settings',
  children: [
    {
      // UserProfile will be rendered inside User's <router-view>
      // when /user/:id/profile is matched
      path: 'translations',
      component: Translations,
      meta: { requiresAuth: true }
    }
  ]
}]

export default SettingsRoutes
