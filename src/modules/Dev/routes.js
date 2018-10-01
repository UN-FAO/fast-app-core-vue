const Dev = r =>
  require.ensure([], () => r(require("./views/dev")), "dev-module");

let DevRoutes = [
  {
    path: "/dev",
    component: Dev,
    name: "Dev",
    meta: { requiresAuth: true }
  }
];

export default DevRoutes;
