import { useRouter } from "rezact/router";

const router = useRouter();

router.addRoute("/404", () => import("./404"));
router.addRoute("/", () => import("src/components/HomePage"));
router.addRoute(
  "/array-state-persistent-across-route-changes",
  () => import("src/components/HomePageStatePersistsAcrossRouteChanges")
);
router.addRoute(
  "/benchmark",
  () => import("src/examples/BenchmarkRezact/Benchmark")
);
router.addRoute("/counter", () => import("src/examples/CounterRezact/Counter"));
router.addRoute(
  "/counter-multiple",
  () => import("src/examples/CounterMultipleRezact/CounterMultiple")
);
router.addRoute("/list", () => import("src/examples/ListRezact/List"));
router.addRoute(
  "/nested",
  () => import("src/examples/NestedRezact/NestedChildren")
);
router.addRoute(
  "/hello-world",
  () => import("src/examples/HelloWorldRezact/HelloWorld")
);
router.addRoute(
  "/hello-world-multiple",
  () => import("src/examples/HelloWorldMultipleRezact/HelloWorldMultiple")
);
router.addRoute("/mdx", () => import("src/components/Test.mdx"));

router.addRoute(
  "/post/:id/something/:test",
  () => import("src/examples/RouteWithPathParams/index")
);

router.addRoute(
  "/shadow-dom",
  () => import("src/examples/ShadowDom/ShadowDomForExample")
);

router.addRoute(
  "/data-fetching",
  () => import("src/examples/DataFetching/DataFetching")
);

router.addRoute(
  "/uncontrolled-forms",
  () => import("src/examples/Forms/UncontrolledForms")
);

router.addRoute(
  "/controlled-forms",
  () => import("src/examples/Forms/ControlledForms")
);

router.addRoute(
  "/escape-hatches",
  () => import("src/examples/EscapeHatches/EscapeHatches")
);

router.addRoute("/todos", () => import("src/examples/Todo/Todo"));

router.addRoute("/list-redraw", () => import("src/examples/ListReRender/App"));

router.addRoute(
  "/reactive-computations",
  () => import("src/examples/ReactiveComputations/ReactiveComp")
);

router.addRoute("/store-test", () => import("src/examples/StoreTest/App"));

router.addRoute(
  "/simple-string-list",
  () => import("src/examples/SimpleStringListState/SimpleStringList")
);

router.addRoute(
  "/form-validation",
  () => import("src/examples/FormValidation/FormValidation")
);

router.addRoute(
  "/value-attribute-dot-notation",
  () => import("src/examples/ValueAttributeDotNotation/ValueAttributeDot")
);

router.addRoute(
  "/component-context",
  () => import("src/examples/ComponentContext/ComponentContext")
);

router.addRoute(
  "jsx-signals",
  () => import("src/examples/JsxSignals/JsxSignals")
)
export { router };
