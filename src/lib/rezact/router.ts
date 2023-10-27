import { render } from "rezact";
import { Signal } from "./signals";

export const $currentRoute = new Signal("") as unknown as string;
export const $currentPath = new Signal("") as unknown as string;

function isPromise(value) {
  return Boolean(value && typeof value.then === "function");
}

function copyNextRoute(nextRoute) {
  const pathObj = typeof nextRoute === "object";
  const newURLObj = (pathObj
    ? new URL(nextRoute)
    : new URL(nextRoute, window.location.origin)) as unknown as routeIF;

  ($currentRoute as any).set(nextRoute.route || "/");
  ($currentPath as any).set(newURLObj.pathname);

  newURLObj.route = nextRoute.route || "/";
  newURLObj.$route = $currentRoute;
  newURLObj.$pathname = $currentPath;

  newURLObj.go = (delta: number) => history.go(delta);
  newURLObj.back = () => history.back();
  newURLObj.forward = () => history.forward();
  newURLObj.reload = () => location.reload();
  newURLObj.push = (...args: [any, string, (string | URL | null)?]) =>
    history.pushState(...args);
  newURLObj.replace = (...args: [any, string, (string | URL | null)?]) =>
    history.replaceState(...args);

  newURLObj.params = nextRoute.params;
  newURLObj.stack = nextRoute.stack;
  newURLObj.currentNode = nextRoute.currentNode;
  return newURLObj;
}

class RouteNode {
  handlers: any;
  children: Map<any, any>;
  dynamicChild: any = null;
  wildcardHandler: any = null;
  router_outlet: Signal<Element>;
  nestedRoot: boolean;
  partName: string;
  title: string;
  constructor() {
    this.handlers = {};
    this.children = new Map();
    this.dynamicChild = null;
    this.wildcardHandler = null;
    this.router_outlet = new Signal(document.createElement("span"));
    this.nestedRoot = false;
  }
}

export interface routerProp {
  router: routeIF;
}

interface routeIF {
  hash: string;
  host: string;
  hostname: string;
  href: string;
  origin: string;
  pathname: string;
  $pathname: any;
  port: string;
  protocol: string;
  search: string;
  builtPath: string;
  route: string;
  $route: any;
  params: any;
  stack: any;
  currentNode: any;
  outlet?: Signal<Element>;
  go?: (delta: number) => void;
  back?: () => void;
  forward?: () => void;
  reload?: () => void;
  push?: (...args: [data: any, unused: string, url?: string | URL]) => void;
  replace?: (...args: [data: any, unused: string, url?: string | URL]) => void;
}

const defaultRouteObj: routeIF = {
  hash: "",
  host: "",
  hostname: "",
  href: "",
  origin: "",
  pathname: "",
  $pathname: new Signal(""),
  port: "",
  protocol: "",
  search: "",
  builtPath: "",
  route: "",
  $route: new Signal(""),
  params: {},
  stack: [],
  currentNode: null,
};

export class TrieRouter {
  root: RouteNode;
  beforeHooks: any = [];
  currentRoute: routeIF = { ...defaultRouteObj };
  renderFunc: any = null;
  popState: boolean = false;
  noRoute: any = (router) => {
    return router.getNextRoute("/404").currentNode;
  };
  constructor(options) {
    if (!options.render) throw new Error("render function is required");
    this.renderFunc = options.render;
    if (options.noRoute) this.noRoute = options.noRoute;
    document.body.addEventListener("click", (ev: any) => {
      if (ev.target.nodeName === "A") {
        if (!ev.target.href) return;
        if (ev.target.target) return;
        const url = new URL(ev.target.href);
        const locationHost = window.location.hostname; // Current page's hostname
        if (url.hostname !== locationHost) return;
        ev.preventDefault();
        this.routeChanged(url.pathname);
      }
    });
    this.root = new RouteNode();
    const that = this;
    window.addEventListener("popstate", function (event) {
      that.routeChanged(event);
    });
    // window.onpopstate = this.routeChanged.bind(this);
  }

  runBeforeHooks(pathObj) {
    if (!pathObj) return;
    for (let hook of this.beforeHooks) {
      const result = hook(pathObj, this.currentRoute);
      if (isPromise(result)) {
        result.then((res) => {
          if (res === false) return;
          if (res) return this.routeRequest(res);
          this.routeRequest(pathObj);
        });
      } else {
        if (result === false) return;
        if (result) return this.routeRequest(result);
        this.routeRequest(pathObj);
      }
    }
  }

  routeChanged(path = null) {
    if (path instanceof PopStateEvent) this.popState = true;
    const url = path || window.location.pathname;

    if (this.beforeHooks.length === 0) return this.routeRequest(url);

    let pathObj = this.getNextRoute(url);
    this.runBeforeHooks(pathObj);
  }

  beforeEach(callback) {
    this.beforeHooks.push(callback);
  }

  addRoutesFromConfig(config, parentPath = "") {
    config.forEach((route) => {
      const currentPath = `${parentPath}${route.path}`;
      if (route.component)
        this.addRoute(currentPath, route.component, false, {
          title: route.title,
        });

      if (route.children && route.children.length > 0) {
        this.addRoutesFromConfig(route.children, currentPath);
      }
    });
  }

  addRoute(path, callback, nestedRoot = false, opts: any = {}) {
    const parts = path.split("/").filter(Boolean);
    let firstPartRootSet = false;
    let currentNode = this.root;
    if (path === "/") this.root.title = opts.title;

    for (let part of parts) {
      if (part.startsWith(":")) {
        if (!currentNode.dynamicChild) {
          currentNode.dynamicChild = new RouteNode();
          currentNode.dynamicChild.title = opts.title;
          currentNode.dynamicChild.partName = `/${part}`;
          currentNode.dynamicChild.isDynamic = part.slice(1);
        }
        currentNode = currentNode.dynamicChild;
      } else if (part.startsWith("*")) {
        currentNode.wildcardHandler = new RouteNode();
        currentNode.wildcardHandler.title = opts.title;
        currentNode.wildcardHandler.partName = `/${part}`;
        currentNode.wildcardHandler.isDynamic = part.slice(1);
        currentNode.wildcardHandler.handlers.GET = callback;
        currentNode.wildcardHandler.nestedRoot = nestedRoot;
        return; // wildcard matches the rest of the route, so return
      } else {
        if (!currentNode.children.has(part)) {
          currentNode.children.set(part, new RouteNode());
          currentNode.children.get(part).title = opts.title;
          currentNode.children.get(part).partName = `/${part}`;
        }
        currentNode = currentNode.children.get(part);
      }
      if (!firstPartRootSet) currentNode.nestedRoot = true;
      firstPartRootSet = true;
    }

    currentNode.handlers.GET = callback;
    currentNode.nestedRoot = currentNode.nestedRoot || nestedRoot;
  }

  getNextRoute(path, paramID = null, paramVal = null): routeIF {
    if (path !== "/404") path = this.popState ? window.location.pathname : path;
    const parts = path.split("/").filter(Boolean);
    let currentNode = this.root;

    let route = "";
    let builtPath = "";
    let params = {};
    let stack = [];
    let partIdx = 0;

    for (let part of parts) {
      if (currentNode.nestedRoot) stack = [];
      if (currentNode.handlers.GET) stack.push(currentNode);

      if (currentNode.children.has(part)) {
        currentNode = currentNode.children.get(part);
        route += currentNode.partName;
        builtPath += `/${part}`;
      } else if (currentNode.dynamicChild) {
        const paramName = currentNode.dynamicChild.isDynamic;
        const partOverride = paramID === paramName ? paramVal : null;
        if (!paramID) {
          params[paramName] = part;
          params[`$${paramName}`] = new Signal(part);
          params[`$${paramName}`].subscribe((val) => {
            const newURL = this.getNextRoute(location.pathname, paramName, val);
            val !== part && history.pushState({}, "", newURL.builtPath);
          });
        }

        currentNode = currentNode.dynamicChild;
        route += currentNode.partName;
        builtPath += `/${partOverride || part}`;
      } else if (currentNode.wildcardHandler) {
        const paramName = currentNode.wildcardHandler.isDynamic || "rest";
        const partOverride = paramID === paramName ? paramVal : null;
        if (!paramID) {
          const rest = parts.slice(partIdx).join("/");
          params[paramName] = rest;
          params[`$${paramName}`] = new Signal(rest);
          params[`$${paramName}`].subscribe((val) => {
            const newURL = this.getNextRoute(location.pathname, paramName, val);
            val !== rest && history.pushState({}, "", newURL.builtPath);
          });
        }
        currentNode = currentNode.wildcardHandler;
        route += currentNode.partName;
        builtPath += `/${partOverride || part}`;
        break; // wildcard matches the rest of the route, so return
      } else {
        currentNode = this.noRoute(this);
        break;
      }

      partIdx++;
    }

    const newURLObj = new URL(
      path,
      window.location.origin
    ) as unknown as routeIF;

    newURLObj.route = route;
    newURLObj.builtPath = builtPath;
    newURLObj.params = params;
    newURLObj.stack = stack;
    newURLObj.currentNode = currentNode;
    return newURLObj;
  }

  routeRequest(path) {
    path = this.popState ? window.location.pathname : path;
    const pathObj = typeof path === "object";
    let nextRouteObj = pathObj ? path : this.getNextRoute(path);

    let { currentNode } = nextRouteObj;
    this.currentRoute = copyNextRoute(nextRouteObj);
    !this.popState && history.pushState({}, "", nextRouteObj.pathname);

    this.popState = false;
    const handler = currentNode.handlers.GET;
    if (handler) {
      if (currentNode.nestedRoot) this.currentRoute.stack = [];
      this.currentRoute.stack.push(currentNode);
      this.renderFunc(this.currentRoute);
    } else {
      return this.noRoute(this);
    }
  }
}

export const nestedRoot = true;

export function useRouter(app = null, config: any = {}) {
  if (!config.routeErrorComponent)
    config.routeErrorComponent = ({ reason }) => {
      const div = document.createElement("div");
      div.innerText = "Route Failed to Load, Reason: " + reason;
      return { default: () => div };
    };

  if (!app) app = document.getElementById("app");

  let currentLayout = null;
  let router_outlet = new Signal(document.createElement("span"));

  return new TrieRouter({
    render: async (router: routeIF) => {
      if (router.currentNode.title) document.title = router.currentNode.title;
      const { stack } = router;
      const routePromises = stack.map((node) => node.handlers.GET());
      const routes = await Promise.allSettled(routePromises);
      const pages = routes.map(({ status, reason, value }: any) =>
        status === "rejected" ? config.routeErrorComponent({ reason }) : value
      );

      // loop over the stack in reverse and assign router_outlet
      for (let i = stack.length - 1; i >= 0; i--) {
        const thisItem = stack[i];

        thisItem.router_outlet.subs = new Map();
        thisItem.router_outlet.set(document.createElement("span"));

        const nextItem = stack[i + 1];
        if (nextItem) {
          const mod = pages[i + 1];
          const component = mod.Page || mod.default;

          router.outlet = nextItem.router_outlet;
          render(thisItem.router_outlet, component, { router });
        }
      }

      const mod = pages[0];
      const component = mod.Page || mod.default;
      if (mod.Layout) {
        if (currentLayout === mod.Layout) {
          router.outlet = stack[0].router_outlet;
          render(router_outlet, component, { router });
        } else {
          currentLayout = mod.Layout;

          router.outlet = stack[0].router_outlet;
          render(router_outlet, component, { router });

          router.outlet = router_outlet;
          render(app, (props) => mod.Layout(props), { router });
        }
      } else {
        currentLayout = null;

        const mod = pages[0];
        const component = mod.Page || mod.default;
        router.outlet = stack[0].router_outlet;
        render(app, component, { router });
      }
    },
  });
}
