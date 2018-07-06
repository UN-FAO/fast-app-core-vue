const PageManeger = (r) =>
  require.ensure(
    [],
    () => r(require('./views/pageManager')),
    'pagemanager-module'
  );

let PageManegerRoutes = [
  {
    path: '/page/:pageId',
    component: PageManeger,
    name: 'pageManager',
    meta: { requiresAuth: true }
  }
];

export default PageManegerRoutes;
