const TableauShow = r =>
  require.ensure([], () => r(require('./views/tableau')), 'offline-module')

let TableauRoutes = [{
    path: '/tableau/tableau',
    component: TableauShow,
    name: 'tableau',
    meta: {
      requiresAuth: true
    }
  }
]

export default TableauRoutes
