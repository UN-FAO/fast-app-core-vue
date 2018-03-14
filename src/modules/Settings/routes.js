const Settings = r =>
  require.ensure([], () => r(require('./views/settings')), 'offline-module')

const Translations = r =>
  require.ensure([], () => r(require('./components/translations')), 'offline-module')

const Reviewer = r =>
  require.ensure([], () => r(require('./components/assignReviewer')), 'offline-module')

const AllData = r =>
  require.ensure([], () => r(require('./components/AllData')), 'offline-module')

let SettingsRoutes = [{
  path: '/settings',
  component: Settings,
  name: 'settings',
  children: [
    {
      // TRanslations will be renderer inside <router-view>
      // when /settings/translations is matched
      path: 'translations',
      name: 'translations',
      component: Translations,
      meta: { requiresAuth: true }
    },
    {
      path: 'reviewers',
      name: 'reviewers',
      component: Reviewer,
      meta: { requiresAuth: true }
    },
    {
      path: 'alldata',
      name: 'alldata',
      component: AllData,
      meta: { requiresAuth: true }
    }
  ]
}]

export default SettingsRoutes
