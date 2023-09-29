import {
  Signal,
  computeSub,
  createComputed,
  overrideCreateComputed,
} from "./signals";
import {
  addAppendChildHook,
  appendChild,
  childArrayHandler,
  childNodeHandler,
  createComment,
  createComponent,
  createDocumentFragment,
  createElement,
  isArray,
} from ".";

overrideCreateComputed(_createComputed);

function _createComputed(func: (obj: any) => {}, deps: any[]) {
  const NewState = deps[0] instanceof MapSignal ? MapSignal : Signal;
  const newState: any = new NewState(func(deps));
  newState.computed = true;
  const depsLen = deps.length;
  for (let i = 0; i < depsLen; i++) {
    deps[i].subscribe({ funcRef: computeSub, obj: { newState, func, deps } });
  }
  return newState;
}

function findNestedStates(obj, results = [], skipKeys = []) {
  if (obj instanceof Window) return [];
  if (obj instanceof Document) return [];
  if (obj instanceof HTMLElement) return [];
  if (obj instanceof Node) return [];

  // Check if the input is an object
  if (typeof obj === "object" && obj !== null) {
    // If it's an array, iterate over each element
    if (Array.isArray(obj)) {
      for (let item of obj) {
        findNestedStates(item, results, skipKeys);
      }
    } else {
      // If it's an object, iterate over each property
      for (let key in obj) {
        if (key.startsWith("$")) {
          results.push(obj[key]);
        }
        if (skipKeys.includes(key)) continue;
        if (obj[key] instanceof Window) continue;
        if (obj[key] instanceof Document) continue;
        if (obj[key] instanceof HTMLElement) continue;
        if (obj[key] instanceof Node) continue;

        findNestedStates(obj[key], results, skipKeys);
      }
    }
  }
  return results;
}

function findNestedMapSignals(item) {
  return findNestedStates(
    item,
    [],
    [
      "elmRef",
      "idxState",
      "deps",
      "subs",
      "func",
      "associatedState",
      "state",
      "computed",
    ]
  );
}

function subscribeToNestedStates(item, mapStateObj) {
  if (!(item.elmRef instanceof HTMLElement)) return;
  const nestedStates = findNestedMapSignals(item.value);
  nestedStates.forEach((state) => {
    item.nestedSubscribed = true;

    state.subscribe(
      () => {
        if (
          mapStateObj.deps &&
          mapStateObj.deps.length > 0 &&
          mapStateObj.deps[0] instanceof MapSignal
        ) {
          mapStateObj.deps[0].refresh();
        } else {
          mapStateObj.refresh();
        }
      },
      { elm: item.elmRef }
    );
  });
}

export class MapSignal extends Signal {
  elmRefCache: any = new Map();
  refreshTimer: any;
  clearCacheTimer: any;

  constructor(st: any) {
    super(st);
    ["push", "pop", "splice", "shift", "unshift", "reduce"].forEach((item) => {
      this[item] = (...args) => {
        this.value[item](...args);
        this.updateList(this.func);
        this.alertSubs(this.value);
      };
    });
  }

  removeStaleElmRefCacheItems() {
    if (this.clearCacheTimer) clearTimeout(this.clearCacheTimer);
    this.clearCacheTimer = setTimeout(() => {
      for (let [key, value] of this.elmRefCache) {
        if (!value.isConnected) {
          this.elmRefCache.delete(key);
        }
      }
      this.deps &&
        this.deps.forEach((dep) => {
          if (dep instanceof MapSignal) {
            dep.removeStaleElmRefCacheItems();
          }
        });
    }, 10);
  }

  Map(func: any) {
    if (!func.args) {
      this.func = func;
      const _args = func.toString().split("=>")[0].replaceAll(" ", "");
      const args = _args.slice(1, _args.length - 1).split(",");
      func.args = args;
    }
    this.updateList(func);
    return this.value;
  }

  updateList(func) {
    if (func === undefined) return;
    const len = this.value.length;
    for (let idx = 0; idx < len; idx++) {
      let item = this.value[idx];
      if (!item.state) this.value[idx] = item = new Signal(item);
      item.__private_idx = idx;
      if (func.args[1]) {
        if (!item.idxState) {
          item.idxState = new Signal(0);
        }
        item.idxState.set(idx);
      }

      let cachedElmRef = this.elmRefCache.get(item);
      if (cachedElmRef?.isConnected === false) {
        this.elmRefCache.delete(item);
        cachedElmRef = undefined;
      }

      if (
        item.elmRef?.isConnected === false ||
        item.elmRef?.isConnected === undefined
      )
        item.elmRef = undefined;

      item.elmRef = cachedElmRef || createComponent({ func, item });
      if (!cachedElmRef) this.elmRefCache.set(item, item.elmRef);

      if (!item.nestedSubscribed) {
        subscribeToNestedStates(item, this);
      }

      isArray(item.elmRef)
        ? item.elmRef.forEach((elm) => (elm.associatedState = item))
        : (item.elmRef.associatedState = item);
    }
  }

  deleteValue(valToDelete: any) {
    const index = valToDelete.__private_idx || this.value.indexOf(valToDelete);
    if (index < 0) return;
    if (valToDelete.elmRef && valToDelete.elmRef instanceof HTMLElement) {
      this.elmRefCache.delete(valToDelete);
      valToDelete.elmRef.remove();
    }
    this.value.splice(index, 1);
    this.alertSubs(this.value);
    setTimeout(() => this.updateList(this.func), 0);
  }

  toJson() {
    return this.value.map((thisVal) => {
      if (thisVal.toJson) return thisVal.toJson();
      thisVal.getValue ? thisVal.getValue() : thisVal;
    });
  }

  refresh = () => {
    if (this.refreshTimer) clearTimeout(this.refreshTimer);
    this.refreshTimer = setTimeout(() => {
      this.updateList(this.func);
      this.alertSubs(this.value);
    }, 10);
  };
}

const addChildren = (values: any, parentNode) => {
  if (values === undefined) return;
  const len = values.length;
  let nextNode = parentNode;
  for (let i = 0; i < len; i++) {
    const elm = values[i].elmRef;
    if (!(nextNode.nextSibling === (elm[0] || elm))) {
      appendChild(nextNode, elm, true);
    }
    nextNode = isArray(elm) ? elm.at(-1) : elm;
  }
};

const remPlaceHolder = createElement("span");
const removeStaleChildren = (parentNode, endNode, parent, child) => {
  const values = child.value;
  let nextNode = parentNode.nextSibling;

  if (!parentNode.parentNode) return;

  if (
    parentNode.parentNode.childNodes.length === child.previousChildLen + 2 &&
    values.length === 0
  ) {
    child.removeStaleElmRefCacheItems();
    return (parentNode.parentNode.innerHTML = "");
  }

  if (values.length === 0) {
    let frag = createDocumentFragment();
    const placeholder = createElement("span");
    parent.parentNode.insertBefore(placeholder, parent);
    frag.appendChild(parent);
    while (nextNode !== endNode) {
      const thisNode = nextNode;
      nextNode = nextNode.nextSibling;
      thisNode.remove();
    }
    placeholder.parentNode.insertBefore(frag, placeholder);
    parent.appendChild(frag);
    placeholder.remove();
    return;
  }

  let elmRefIdx = 0;
  const childLen = values[0].elmRef.length || 1;
  let inc = 0;
  while (nextNode !== endNode) {
    const idx = Math.floor(inc / childLen);
    elmRefIdx = inc % childLen;
    const val = values[idx];
    let elmRef = val && val.elmRef && (val?.elmRef[elmRefIdx] || val?.elmRef);

    if (values.indexOf(nextNode.associatedState) < 0) {
      nextNode = nextNode.nextSibling;
      const prevElm = nextNode.previousSibling;
      if (prevElm.replaceWith && elmRef instanceof HTMLElement) {
        prevElm.replaceWith(elmRef);
        nextNode = elmRef.nextSibling;
      } else {
        prevElm.remove();
      }
    } else if (val && elmRef && nextNode !== elmRef) {
      nextNode = nextNode.nextSibling;
      const prevElm = nextNode.previousSibling;
      if (
        prevElm.replaceWith &&
        elmRef instanceof HTMLElement &&
        elmRef.parentNode
      ) {
        elmRef.replaceWith(remPlaceHolder);
        prevElm.replaceWith(elmRef);
        remPlaceHolder.replaceWith(prevElm);
      } else {
        if (elmRef instanceof HTMLElement) elmRef.remove();
      }
    } else {
      nextNode = nextNode.nextSibling;
    }
    inc += 1;
  }
};

const handleArray = (parent: any, child: any) => {
  const frag = createDocumentFragment();
  const frac = frag.appendChild.bind(frag);
  const parentNode = createComment("start map");
  const endNode = createComment("end map");
  const placeHolder = createComment("map-placeholder");

  frac(parentNode);
  frac(endNode);

  child.subscribe((newVal: any) => {
    // if (!parentNode.isConnected || !endNode.isConnected) return;
    if (child.previousChildLen === 0) {
      if (parentNode.parentNode) parent.insertBefore(placeHolder, parentNode);

      frac(parentNode);
      frac(endNode);
    }
    removeStaleChildren(parentNode, endNode, parent, child);
    addChildren(newVal, parentNode);
    if (child.previousChildLen === 0) {
      if (placeHolder.parentNode) {
        parent.insertBefore(frag, placeHolder);
      } else {
        parent.appendChild(frag);
      }
    }
    child.previousChildLen = child.value.length;
    placeHolder.remove();
  });

  child.previousChildLen = child.value.length;
  addChildren(child.value, parentNode);
  parent.appendChild(frag);
};

const childStateHandler = {
  matches: (child) => isArray(child.value) && child.state,
  handler: (parent, child) => handleArray(parent, child),
};

addAppendChildHook(childStateHandler);

function insertNodeAfter(currentNode: any, childNode: any) {
  if (currentNode.nextSibling) {
    currentNode.parentNode.insertBefore(childNode, currentNode.nextSibling);
  } else if (currentNode.parentNode) {
    currentNode.parentNode.appendChild(childNode);
  }
}

function appendChildNode(
  parentNode: any,
  childNode: any,
  insertAfter: boolean = false,
  removeElm: boolean = false
) {
  if (removeElm) return childNode.remove();
  if (parentNode instanceof Comment) insertAfter = true;
  if (parentNode.state) return;
  // console.log({ parentNode, childNode, insertAfter });
  insertAfter
    ? insertNodeAfter(parentNode, childNode)
    : parentNode.appendChild(childNode);
}

childNodeHandler.handler = (parent, child, insertAfter, removeElm) =>
  appendChildNode(parent, child, insertAfter, removeElm);

childArrayHandler.handler = (parent, child, insertAfter, removeElm) => {
  const len = child.length;
  if (insertAfter && isArray(child)) {
    for (let i = len - 1; i > -1; i--) {
      appendChild(parent, child[i], insertAfter, removeElm);
    }
  } else {
    for (let i = 0; i < len; i++) {
      appendChild(parent, child[i], insertAfter, removeElm);
    }
  }
};

export const createMapped = (func, deps) => {
  const computed: any = createComputed(func, deps);
  computed.deps = deps;
  computed.mapStateObj = false;
  return computed;
};
