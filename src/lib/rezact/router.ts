import { render } from "rezact";
import { Signal } from "./signals";

export const $currentRoute = new Signal("") as unknown as string;
export const $currentPath = new Signal("") as unknown as string;

function isPromise(value) {
  return Boolean(value && typeof value.then === "function");
}

function copyNextRoute(nextRoute, router) {
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
  newURLObj.push = (url) => router.routeChanged(url);
  newURLObj.replace = (url) => router.routeChanged(url, true);
  newURLObj.onBeforeLeave = (callback) => (router.onBeforeLeaveFunc = callback);

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
  meta: any;
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
  meta?: any;
  go?: (delta: number) => void;
  back?: () => void;
  forward?: () => void;
  reload?: () => void;
  push?: (url: string) => void;
  replace?: (url: string) => void;
  onBeforeLeave?: (callback: () => void) => void;
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
  onBeforeLeaveFunc: any = null;
  beforeHooks: any = [];
  afterHooks: any = [];
  previousRoute: routeIF = { ...defaultRouteObj };
  currentRoute: routeIF = { ...defaultRouteObj };
  renderFunc: any = null;
  popState: boolean = false;
  replaceState: boolean = false;
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

        // allow external links to bypass the router
        const locationHost = window.location.hostname;
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

    window.addEventListener("beforeunload", function (e) {
      if (that.onBeforeLeaveFunc) {
        const result = that.onBeforeLeaveFunc({}, that.currentRoute);
        if (result === false) {
          e.preventDefault();
          e.returnValue = "You will lose any unsaved changes.";
          return "You will lose any unsaved changes.";
        }
      }
    });
  }

  async runBeforeHooks(pathObj) {
    if (!pathObj) return;

    if (this.onBeforeLeaveFunc) {
      const result = this.onBeforeLeaveFunc(pathObj, this.currentRoute);
      if (result === false) return;
      if (result) return this.routeRequest(result);
    }

    for (let hook of this.beforeHooks) {
      const result = hook(pathObj, this.currentRoute);
      if (isPromise(result)) {
        const res = await result;
        if (res === false) return;
        if (res) return this.routeRequest(res);
      } else {
        if (result === false) return;
        if (result) return this.routeRequest(result);
      }
    }
    this.routeRequest(pathObj);
  }

  runAfterHooks(pathObj) {
    if (!pathObj) return;
    for (let hook of this.afterHooks) {
      hook(pathObj, this.previousRoute);
    }
  }

  routeChanged(path = null, replace = false) {
    this.replaceState = replace;
    if (path instanceof PopStateEvent) this.popState = true;
    const url = path || window.location.pathname;

    let pathObj = this.getNextRoute(url);
    this.runBeforeHooks(pathObj);
  }

  beforeEach(callback) {
    this.beforeHooks.push(callback);
  }

  afterEach(callback) {
    this.afterHooks.push(callback);
  }

  addRoutesFromConfig(config, parentPath = "") {
    config.forEach((route) => {
      const currentPath = `${parentPath}${route.path}`;
      if (route.component)
        this.addRoute(currentPath, route.component, false, {
          title: route.title,
          meta: route.meta,
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
    if (path === "/") {
      this.root.title = opts.title;
      this.root.meta = opts.meta;
    }

    const setupNode = (node, opts, part) => {
      node.title = opts.title;
      node.meta = opts.meta;
      node.partName = `/${part}`;
    };

    for (let part of parts) {
      if (part.startsWith(":")) {
        if (!currentNode.dynamicChild) {
          currentNode.dynamicChild = new RouteNode();
          setupNode(currentNode.dynamicChild, opts, part);
          currentNode.dynamicChild.isDynamic = part.slice(1);
        }
        currentNode = currentNode.dynamicChild;
      } else if (part.startsWith("*")) {
        currentNode.wildcardHandler = new RouteNode();
        setupNode(currentNode.wildcardHandler, opts, part);
        currentNode.wildcardHandler.isDynamic = part.slice(1);

        currentNode.wildcardHandler.handlers.GET = callback;
        currentNode.wildcardHandler.nestedRoot = nestedRoot;
        return; // wildcard matches the rest of the route, so return
      } else {
        if (!currentNode.children.has(part)) {
          currentNode.children.set(part, new RouteNode());
          setupNode(currentNode.children.get(part), opts, part);
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

  async routeRequest(path) {
    this.onBeforeLeaveFunc = null;
    path = this.popState ? window.location.pathname : path;
    const pathObj = typeof path === "object";
    let nextRouteObj = pathObj ? path : this.getNextRoute(path);

    let { currentNode } = nextRouteObj;
    this.previousRoute = this.currentRoute;
    this.currentRoute = copyNextRoute(nextRouteObj, this);
    !this.popState &&
      !this.replaceState &&
      history.pushState({}, "", nextRouteObj.pathname);
    this.replaceState && history.replaceState({}, "", nextRouteObj.pathname);

    this.popState = false;
    const handler = currentNode.handlers.GET;
    if (handler) {
      if (currentNode.nestedRoot) this.currentRoute.stack = [];
      this.currentRoute.stack.push(currentNode);
      await this.renderFunc(this.currentRoute);
      this.runAfterHooks(nextRouteObj);
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
      const routePromises = stack.map((node) => {
        const test = node.handlers.GET({ router });
        return isPromise(test) ? test : node.handlers.GET;
      });
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
          const component = mod.Page || mod.default || mod;

          router.outlet = nextItem.router_outlet;
          router.meta = nextItem.meta;
          render(thisItem.router_outlet, component, { router });
        }
      }

      const mod = pages[0];
      const component = mod.Page || mod.default || mod;
      const layout = mod.Layout || component.Layout;
      if (layout) {
        if (currentLayout === layout) {
          router.outlet = stack[0].router_outlet;
          router.meta = stack[0].meta;
          render(router_outlet, component, { router });
        } else {
          currentLayout = layout;

          router.outlet = stack[0].router_outlet;
          router.meta = stack[0].meta;
          render(router_outlet, component, { router });

          router.outlet = router_outlet;
          router.meta = stack[0].meta;
          render(app, (props) => layout(props), { router });
        }
      } else {
        currentLayout = null;

        const mod = pages[0];
        const component = mod.Page || mod.default || mod;
        router.outlet = stack[0].router_outlet;
        router.meta = stack[0].meta;
        render(app, component, { router });
      }
    },
  });
}
