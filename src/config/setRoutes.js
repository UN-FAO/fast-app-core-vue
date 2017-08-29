const setRoutes = function (externalRoutes) {
  let routes = []
  let mount = function (Routes) {
    Routes.forEach(function (route) {
      routes.push(route)
    })
  }
  externalRoutes.forEach(function (routes) {
    mount(routes)
  })
  return routes
}

export default setRoutes
