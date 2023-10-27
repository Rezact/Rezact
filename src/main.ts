import { router } from "./components/appRouter";

// router.beforeEach((to, from) => {
//   console.log("beforeEach", { to, from });
//   return "/login";
// });

(window as any).testValues = {};

router.routeChanged();
