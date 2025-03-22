/* ---------------------- ROUTE CHANGE TRIGGER ---------------------- */
const routeChangeTRIGGER = async (to, from) => {
  const fromRoute = (from ? from.fullPath : null);
  const toRoute = to.fullPath;
  //TODO Route changes implementation here
}

let checkRouterInterval = setInterval(() => {
  let routerInstance = window.$nuxt.$router;
  if (routerInstance) {
      clearInterval(checkRouterInterval);

      // Use Vue's beforeEach hook
      routerInstance.beforeEach((to, from, next) => {
        routeChangeTRIGGER(to, from);
        next();
      });

      // Handle the initial route
      routeChangeTRIGGER(window.$nuxt.$route, null);
  }
}, 100);
/* ---------------------- END ROUTE CHANGE TRIGGER ---------------------- */