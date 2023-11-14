import { nestedRoot, useRouter } from "rezact/router";
import { Page as FourOhFour } from "./404";
import Users from "src/examples/NestedRoutes/Users";
import UsersId from "src/examples/NestedRoutes/UsersId";
import UsersIdSettings from "src/examples/NestedRoutes/UsersIdSettings";
import UsersIdSettingsWildCard from "src/examples/NestedRoutes/UsersIdSettingsWildCard";

const router = useRouter();

// router.addRoute("/404", () => import("./404"));

router.addRoute("/404", FourOhFour);

router.addRoute("/refs", () => import("src/examples/Refs/Refs"));

router.addRoute(
  "/array-state-persistent-across-route-changes",
  () => import("src/components/HomePageStatePersistsAcrossRouteChanges"),
);
router.addRoute(
  "/benchmark",
  () => import("src/examples/BenchmarkRezact/Benchmark"),
);
router.addRoute("/counter", () => import("src/examples/CounterRezact/Counter"));
router.addRoute(
  "/counter-multiple",
  () => import("src/examples/CounterMultipleRezact/CounterMultiple"),
);
router.addRoute("/list", () => import("src/examples/ListRezact/List"));
router.addRoute(
  "/nested",
  () => import("src/examples/NestedRezact/NestedChildren"),
);
router.addRoute(
  "/hello-world",
  () => import("src/examples/HelloWorldRezact/HelloWorld"),
);
router.addRoute(
  "/hello-world-multiple",
  () => import("src/examples/HelloWorldMultipleRezact/HelloWorldMultiple"),
);
router.addRoute("/mdx", () => import("src/components/Test.mdx"));

router.addRoute(
  "/post/:id/something/:test",
  () => import("src/examples/RouteWithPathParams/index"),
);

router.addRoute(
  "/shadow-dom",
  () => import("src/examples/ShadowDom/ShadowDomForExample"),
);

router.addRoute(
  "/data-fetching",
  () => import("src/examples/DataFetching/DataFetching"),
);

router.addRoute(
  "/uncontrolled-forms",
  () => import("src/examples/Forms/UncontrolledForms"),
);

router.addRoute(
  "/controlled-forms",
  () => import("src/examples/Forms/ControlledForms"),
);

router.addRoute(
  "/escape-hatches",
  () => import("src/examples/EscapeHatches/EscapeHatches"),
);

router.addRoute("/todos", () => import("src/examples/Todo/Todo"));

router.addRoute("/list-redraw", () => import("src/examples/ListReRender/App"));

router.addRoute(
  "/reactive-computations",
  () => import("src/examples/ReactiveComputations/ReactiveComp"),
);

router.addRoute("/store-test", () => import("src/examples/StoreTest/App"));

router.addRoute(
  "/simple-string-list",
  () => import("src/examples/SimpleStringListState/SimpleStringList"),
);

router.addRoute(
  "/form-validation",
  () => import("src/examples/FormValidation/FormValidation"),
);

router.addRoute(
  "/value-attribute-dot-notation",
  () => import("src/examples/ValueAttributeDotNotation/ValueAttributeDot"),
);

router.addRoute(
  "/component-context",
  () => import("src/examples/ComponentContext/ComponentContext"),
);

router.addRoute(
  "/jsx-signals",
  () => import("src/examples/JsxSignals/JsxSignals"),
);

router.addRoute(
  "/payments/:id",
  () => import("src/examples/RouteWithPathParams/AmbiguousTest1"),
);

router.addRoute(
  "/payments/ach/:id",
  () => import("src/examples/RouteWithPathParams/AmbiguousTest2"),
);

router.addRoute(
  "/users",
  () => import("src/examples/NestedRoutes/Users"),
  nestedRoot,
);
router.addRoute(
  "/users/:id",
  () => import("src/examples/NestedRoutes/UsersId"),
);
router.addRoute(
  "/users/:id/settings",
  () => import("src/examples/NestedRoutes/UsersIdSettings"),
);
router.addRoute(
  "/users/:id/settings/*",
  () => import("src/examples/NestedRoutes/UsersIdSettingsWildCard"),
);

const routes = [
  {
    path: "/",
    component: () => import("src/components/HomePage"),
    title: "Testing Root Title",
  },
  {
    path: "/onBeforeLeave",
    component: () => import("src/examples/OnBeforeLeave/OnBeforeLeave"),
    title: "Testing On Before Leave Title",
  },
  {
    path: "/users2",
    component: () => import("src/examples/NestedRoutes/Users"),
    title: "Users Test 2",
  },
  {
    path: "/users2/:id",
    component: () => import("src/examples/NestedRoutes/UsersId"),
    title: "Users ID Test 2",
    children: [
      {
        path: "/settings",
        component: () => import("src/examples/NestedRoutes/UsersIdSettings"),
        title: "Users Settings Test 2",
      },
      {
        path: "/settings/*",
        component: () =>
          import("src/examples/NestedRoutes/UsersIdSettingsWildCard"),
        title: "Users Catch AllTest 2",
      },
    ],
  },
  {
    path: "/users3",
    component: Users,
    title: "Users Test 3",
    meta: { metaProp: "Users Meta Test 3" },
  },
  {
    path: "/users3/:id",
    component: UsersId,
    title: "Users ID Test 3",
    meta: { metaProp: "Users ID Meta Test 3" },
    children: [
      {
        path: "/settings",
        component: UsersIdSettings,
        title: "Users Settings Test 3",
        meta: { metaProp: "Users Settings Meta Test 3" },
      },
      {
        path: "/settings/*",
        component: UsersIdSettingsWildCard,
        title: "Users Catch AllTest 3",
        meta: { metaProp: "Users Catch All Meta Test 3" },
      },
    ],
  },
  {
    path: "/payments2",
    children: [
      {
        path: "/:id",
        component: () =>
          import("src/examples/RouteWithPathParams/AmbiguousTest1"),
        title: "Payments Test 2",
      },
      {
        path: "/ach/:id",
        component: () =>
          import("src/examples/RouteWithPathParams/AmbiguousTest2"),
        title: "ACH Test 2",
      },
    ],
  },
];

router.addRoutesFromConfig(routes);

export { router };
