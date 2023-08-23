import { BaseState, createComputed } from "./signals";
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

export class MapState extends BaseState {
  constructor(st: any) {
    super(st);
    ["push", "pop", "splice", "shift", "unshift"].forEach((item) => {
      this[item] = (...args) => {
        this.value[item](...args);
        this.updateList(this.func);
        this.alertSubs(this.value);
      };
    });
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
    const len = this.value.length;
    for (let idx = 0; idx < len; idx++) {
      let item = this.value[idx];
      if (!item.state) this.value[idx] = item = new BaseState(item);
      item.__private_idx = idx;
      if (func.args[1]) {
        if (!item.idxState) {
          item.idxState = new BaseState(0);
        }
        item.idxState.setValue(idx);
      }

      if (item.elmRef?.isConnected === false) item.elmRef = undefined;
      item.elmRef = item.elmRef || createComponent({ func, item });

      isArray(item.elmRef)
        ? item.elmRef.forEach((elm) => (elm.associatedState = item))
        : (item.elmRef.associatedState = item);
    }
  }

  deleteValue(valToDelete: any) {
    const index = this.value.indexOf(valToDelete);
    if (index < 0) return;
    if (valToDelete.elmRef) valToDelete.elmRef.remove();
    this.value.splice(index, 1);
    setTimeout(() => this.updateList(this.func), 0);
  }

  toJson() {
    return this.value.map((thisVal) =>
      thisVal.value !== undefined && thisVal.value !== null
        ? thisVal.getValue()
        : thisVal
    );
  }
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

  if (
    parentNode.parentNode.childNodes.length === child.previousChildLen + 2 &&
    values.length === 0
  ) {
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
        elmRef.remove();
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

  frac(parentNode);
  frac(endNode);

  child.subscribe((newVal: any) => {
    if (child.previousChildLen === 0) {
      frac(parentNode);
      frac(endNode);
    }
    removeStaleChildren(parentNode, endNode, parent, child);
    addChildren(newVal, parentNode);
    if (child.previousChildLen === 0) parent.appendChild(frag);
    child.previousChildLen = child.value.length;
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
  } else {
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
  return computed;
};
