import { render } from "rezact";
import { Signal } from "./signals";

function isPromise(value) {
  return Boolean(value && typeof value.then === "function");
}

function copyNextRoute(nextRoute) {
  const pathObj = typeof nextRoute === "object";
  const newURLObj = (pathObj
    ? new URL(nextRoute)
    : new URL(nextRoute, window.location.origin)) as unknown as routeIF;

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
  constructor() {
    this.handlers = {};
    this.children = new Map();
    this.dynamicChild = null;
    this.wildcardHandler = null;
    this.router_outlet = new Signal(document.createElement("span"));
    this.nestedRoot = false;
  }
}

interface routeIF {
  hash: string;
  host: string;
  hostname: string;
  href: string;
  origin: string;
  pathname: string;
  port: string;
  protocol: string;
  search: string;
  params: any;
  stack: any;
  currentNode: any;
}

const defaultRouteObj: routeIF = {
  hash: "",
  host: "",
  hostname: "",
  href: "",
  origin: "",
  pathname: "",
  port: "",
  protocol: "",
  search: "",
  params: {},
  stack: [],
  currentNode: null,
};

export class TrieRouter {
  root: RouteNode;
  beforeHooks: any = [];
  currentRoute: routeIF = { ...defaultRouteObj };
  renderFunc: any = null;
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
    window.onpopstate = this.routeChanged.bind(this);
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
      if (route.component) this.addRoute(currentPath, route.component);

      if (route.children && route.children.length > 0) {
        this.addRoutesFromConfig(route.children, currentPath);
      }
    });
  }

  addRoute(path, callback, nestedRoot = false) {
    const parts = path.split("/").filter(Boolean);
    let firstPartRootSet = false;
    let currentNode = this.root;

    for (let part of parts) {
      if (part.startsWith(":")) {
        if (!currentNode.dynamicChild) {
          currentNode.dynamicChild = new RouteNode();
          currentNode.dynamicChild.isDynamic = part.slice(1);
        }
        currentNode = currentNode.dynamicChild;
      } else if (part.startsWith("*")) {
        currentNode.wildcardHandler = new RouteNode();
        currentNode.wildcardHandler.isDynamic = part.slice(1);
        currentNode.wildcardHandler.handlers.GET = callback;
        currentNode.wildcardHandler.nestedRoot = nestedRoot;
        return; // wildcard matches the rest of the route, so return
      } else {
        if (!currentNode.children.has(part)) {
          currentNode.children.set(part, new RouteNode());
        }
        currentNode = currentNode.children.get(part);
      }
      if (!firstPartRootSet) currentNode.nestedRoot = true;
      firstPartRootSet = true;
    }

    currentNode.handlers.GET = callback;
    currentNode.nestedRoot = currentNode.nestedRoot || nestedRoot;
  }

  getNextRoute(path): routeIF {
    const parts = path.split("/").filter(Boolean);
    let currentNode = this.root;

    let params = {};
    let stack = [];
    let partIdx = 0;

    for (let part of parts) {
      if (currentNode.nestedRoot) stack = [];
      if (currentNode.handlers.GET) stack.push(currentNode);

      if (currentNode.children.has(part)) {
        currentNode = currentNode.children.get(part);
      } else if (currentNode.dynamicChild) {
        params[currentNode.dynamicChild.isDynamic] = part;
        currentNode = currentNode.dynamicChild;
      } else if (currentNode.wildcardHandler) {
        params[currentNode.wildcardHandler.isDynamic || "rest"] = parts
          .slice(partIdx)
          .join("/");
        currentNode = currentNode.wildcardHandler;
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

    newURLObj.params = params;
    newURLObj.stack = stack;
    newURLObj.currentNode = currentNode;
    return newURLObj;
  }

  routeRequest(path) {
    const pathObj = typeof path === "object";
    let nextRouteObj = pathObj ? path : this.getNextRoute(path);

    let { stack, params, currentNode } = nextRouteObj;
    this.currentRoute = copyNextRoute(nextRouteObj);
    history.pushState({}, "", nextRouteObj.pathname);

    const handler = currentNode.handlers.GET;
    if (handler) {
      if (currentNode.nestedRoot) stack = [];
      stack.push(currentNode);
      this.renderFunc(stack, params);
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
    render: async (stack, params) => {
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
          render(thisItem.router_outlet, component, {
            routeParams: params,
            router_outlet: nextItem.router_outlet,
          });
        }
      }

      const mod = pages[0];
      const component = mod.Page || mod.default;
      if (mod.Layout) {
        if (currentLayout === mod.Layout) {
          render(router_outlet, component, {
            routeParams: params,
            router_outlet: stack[0].router_outlet,
          });
        } else {
          currentLayout = mod.Layout;

          render(router_outlet, component, {
            routeParams: params,
            router_outlet: stack[0].router_outlet,
          });

          render(app, (props) => mod.Layout(props), {
            router_outlet,
            routeParams: params,
          });
        }
      } else {
        currentLayout = null;

        const mod = pages[0];
        const component = mod.Page || mod.default;
        render(app, component, {
          routeParams: params,
          router_outlet: stack[0].router_outlet,
        });
      }
    },
  });
}
