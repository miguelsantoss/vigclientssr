/* eslint-disable global-require */

// The top-level (parent) route
const routes = {
  path: '/',

  // Keep in mind, routes are evaluated in order
  children: [
    {
      path: '/',
      load: () => import(/* webpackChunkName: 'home' */ './home'),
    },
    {
      path: '/profile',
      load: () => import(/* webpackChunkName: 'profile' */ './profile'),
    },
    {
      path: '/login',
      load: () => import(/* webpackChunkName: 'login' */ './login'),
    },
    {
      path: '/audits',
      load: () => import(/* webpackChunkName: 'audits' */ './audits'),
    },
    {
      path: '/audit/:id',
      load: () => import(/* webpackChunkName: 'audit' */ './audit'),
    },
    {
      path: '/scan/:id/vulnerabilities',
      load: () => import(/* webpackChunkName: 'scanVulns' */ './scan_vulns'),
    },
    {
      path: '/scan/:id',
      load: () => import(/* webpackChunkName: 'scan' */ './scan'),
    },
    {
      path: '/page/:id',
      load: () => import(/* webpackChunkName: 'page' */ './page'),
    },
    {
      path: '/machine/:id',
      load: () => import(/* webpackChunkName: 'machine' */ './machine'),
    },
    {
      path: '/vulnerability/:id',
      load: () =>
        import(/* webpackChunkName: 'vulnerability' */ './vulnerability'),
    },
    {
      path: '/webvulnerability/:id',
      load: () =>
        import(/* webpackChunkName: 'webvulnerability' */ './webvulnerability'),
    },
    // {
    //   path: '/admin',
    //   load: () => import(/* webpackChunkName: 'admin' */ './admin'),
    // },

    // Wildcard routes, e.g. { path: '*', ... } (must go last)
    {
      path: '*',
      load: () => import(/* webpackChunkName: 'not-found' */ './not-found'),
    },
  ],

  async action({ next }) {
    // Execute each child route until one of them return the result
    const route = await next();

    // Provide default values for title, description etc.
    route.title = `${route.title || 'Untitled Page'} - DRC Vigilante`;
    route.description = route.description || '';

    return route;
  },
};

// The error page is available by permanent url for development mode
if (__DEV__) {
  routes.children.unshift({
    path: '/error',
    action: require('./error').default,
  });
}

export default routes;
