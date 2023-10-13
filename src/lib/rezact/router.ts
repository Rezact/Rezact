import { render } from "rezact";
import { Signal } from "./signals";

class RouteNode {
  handlers: any;
  children: Map<any, any>;
  dynamicChild: any = null;
  wildcardHandler: any = null;
  router_outlet: Signal<Element>;
  nestedRoot: boolean;
  useWildCard: boolean;
  constructor() {
    this.handlers = {};
    this.children = new Map();
    this.dynamicChild = null;
    this.wildcardHandler = null;
    this.router_outlet = new Signal(document.createElement("span"));
    this.nestedRoot = false;
    this.useWildCard = false;
  }
}

export class TrieRouter {
  root: RouteNode;
  renderFunc: any = null;
  noRoute: any = (router) => {
    router.routeRequest("/404");
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
        history.pushState({}, "", url.pathname);
        this.routeRequest(url.pathname);
      }
    });
    this.root = new RouteNode();
    window.onpopstate = this.routeChanged.bind(this);
  }

  routeChanged() {
    const url = window.location.pathname;
    this.routeRequest(url);
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
      } else if (part === "*") {
        currentNode.wildcardHandler = new RouteNode();
        currentNode.wildcardHandler.useWildCard = true;
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

  routeRequest(path) {
    const parts = path.split("/").filter(Boolean);
    let currentNode = this.root;
    let wildCardHandler = null;
    let params = {};
    let stack = [];

    for (let part of parts) {
      if (currentNode.nestedRoot) stack = [];
      if (currentNode.handlers.GET) stack.push(currentNode);

      if (currentNode.children.has(part)) {
        currentNode = currentNode.children.get(part);
      } else if (currentNode.dynamicChild) {
        params[currentNode.dynamicChild.isDynamic] = part;
        currentNode = currentNode.dynamicChild;
      } else if (currentNode.wildcardHandler) {
        currentNode = currentNode.wildcardHandler;
        break; // wildcard matches the rest of the route, so return
      } else {
        return this.noRoute(this);
      }
    }

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

export function useRouter(app = null, config = null) {
  if (config) return new TrieRouter(config);

  if (!app) app = document.getElementById("app");

  let currentLayout = null;
  let router_outlet = new Signal(document.createElement("span"));
  return new TrieRouter({
    render: async (stack, params) => {
      console.log(stack);
      const routePromises = stack.map((node) => node.handlers.GET());
      const routes = await Promise.allSettled(routePromises);

      // loop over stacks and assign router_outlet
      for (let i = 0; i < stack.length; i++) {
        if (routes[i].status === "rejected") {
        }
        const thisItem = stack[i];
        // thisItem.router_outlet = new Signal(document.createElement("span"));
        // thisItem.router_outlet.subs = new Map();
        // thisItem.router_outlet.set(document.createElement("span"));
        console.log(thisItem.router_outlet.value);
        const nextItem = stack[i + 1];
        if (nextItem) {
          console.log("nextItem");
          // nextItem.router_outlet = new Signal(document.createElement("span"));
          const mod = routes[i + 1].value;
          const component = mod.Page || mod.default;
          render(thisItem.router_outlet, component, {
            routeParams: params,
            router_outlet: nextItem.router_outlet,
          });
        }
      }

      const pages = routes.map((route) => route.value);
      console.log(pages);
      // const page = pages[0].value;
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
