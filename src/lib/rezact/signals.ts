import {
  addAfterRenderHook,
  addAppendChildHook,
  addAttributeHandler,
  appendChild,
  setCreateCompFunc,
  isArray,
  createComment,
  createElement,
  createTextNode,
  handleInputValue,
  createDocumentFragment,
} from ".";

let batchSubs = [];
let batchUnsubs = [];
let batchTime = -1;
function resetBatchTimeout() {
  setTimeout(runBatch, 100);
}

function runBatch() {
  if (batchTime === -1 || Date.now() + 100 < batchTime)
    return resetBatchTimeout();

  const batchSubsLen = batchSubs.length;
  for (let i = batchSubsLen - 1; i > -1; i--) {
    const func = batchSubs[i];

    func.stateObj.subs.set(func, true);
    if (func.funcRef) {
      func.obj.newVal = func.stateObj.get();
      func.funcRef(func.obj);
    } else {
      func(func.stateObj.get());
    }
    batchSubs.splice(i, 1);
    // console.debug((window as any).totalSubscriberCount++);
  }

  const batchUnsubsLen = batchUnsubs.length - 1;
  for (let idx = batchUnsubsLen; idx > -1; idx--) {
    const unsub = batchUnsubs[idx];
    if (!unsub.elm.isConnected) {
      unsub.func.stateObj.subs.delete(unsub.func);
      batchUnsubs.splice(idx, 1);
      // console.debug((window as any).totalSubscriberCount--);
    }
  }

  if (batchSubs.length === 0) batchTime = -1;
  resetBatchTimeout();
}
resetBatchTimeout();

let subscFunctionsArr: any = [];
// console.debug(((window as any).totalSubscriberCount = 0));

function createSignalElement(elm: any): any {
  if (isArray(elm)) {
    const signalElm = createComment("signal");
    elm.push(signalElm);
    return signalElm;
  }
  return elm;
}

setCreateCompFunc(_createComponent);
function _createComponent(tagName, attributes: any = null) {
  let previousSubscFuncs = subscFunctionsArr;
  subscFunctionsArr = tagName.subs = [];

  const compElm = tagName.func
    ? tagName.func(tagName.item, tagName.item.idxState)
    : tagName(attributes);

  if (tagName.subs.length > 0) {
    const firstElm = createSignalElement(compElm);
    attachSubs(firstElm, tagName.subs);
  }
  tagName.subs = null;
  subscFunctionsArr = previousSubscFuncs;

  return compElm;
}

function attachSubs(elm, subFuncs) {
  if (isArray(subFuncs)) {
    batchSubs.push(...subFuncs);
    const subFuncsLen = subFuncs.length;
    for (let i = 0; i < subFuncsLen; i++) {
      batchUnsubs.push({ elm, func: subFuncs[i] });
    }
  } else {
    batchSubs.push(subFuncs);
    batchUnsubs.push({ elm, func: subFuncs });
  }
  batchTime = Date.now();
}

export class Signal<T> {
  state = true;
  value: any = null;
  subs: any = new Map();
  computed: any;
  deps: any;
  elmRef: any;
  idxState: any;
  func: any;

  constructor(st: T) {
    this.value = st;
  }

  alertSubs(newVal: any) {
    for (const sub of this.subs.keys()) {
      if (sub.funcRef) {
        sub.obj.newVal = newVal;
        sub.funcRef(sub.obj);
        sub.obj.newVal = null;
      } else {
        sub(newVal);
      }
    }
  }

  get(): T {
    if (this.value instanceof Text) return this.value.nodeValue as T;
    return this.value;
  }

  set(newVal: T) {
    const val = this.get();

    if (newVal === val && !isArray(newVal)) return;

    if (
      val instanceof Element &&
      newVal instanceof Element &&
      val !== newVal &&
      val.parentNode
    )
      val.replaceWith(newVal);

    if (this.value instanceof Text) {
      (this.value.nodeValue as T) = newVal;
    } else {
      this.value = newVal;
    }

    this.alertSubs(newVal);

    batchTime = Date.now();
  }

  subscribe(func: any, opts: any = {}) {
    func.stateObj = this;

    if (opts.elm) {
      attachSubs(opts.elm, func);
    } else {
      subscFunctionsArr.push(func);
      return () => {
        const idx = subscFunctionsArr.findIndex((f) => f === func);
        subscFunctionsArr.slice(idx, 1);
      };
    }
  }

  toJSON() {
    if (this.value.state) return this.value.toJSON();
    if (typeof this.value === "object" && !isArray(this.value)) {
      const newObj = {};
      Object.keys(this.value).map((key) => {
        const val = this.value[key];
        if (val.state) return (newObj[key] = val.toJSON());
        newObj[key] = val;
      });
      return newObj;
    }

    return this.get();
  }
}

export const computeSub = (obj) => obj.newState.set(obj.func(obj.deps));

export function effect(func: (obj: any) => {}, deps: any[]) {
  const newState: any = new deps[0].constructor(func(deps));
  newState.computed = true;
  const depsLen = deps.length;
  const unSubs = [];
  for (let i = 0; i < depsLen; i++) {
    const unsub = deps[i].subscribe({
      funcRef: computeSub,
      obj: { newState, func, deps },
    });
    unSubs.push(unsub);
  }

  newState.unsubscribe = () => {
    unSubs.forEach((f) => f());
  };
  return newState;
}

export function attrEffect(func: (obj: any) => {}, deps: any[]) {
  return { computer: func, deps };
}

const textTypes = { string: true, number: true };
function handleStateTypes(parent: any, child: any, ...args: any[]) {
  const val = child.get();
  if (textTypes[typeof val]) {
    handleTextNode(parent, child, ...args);
  } else if (val instanceof Node && !child.computed) {
    handleArray(parent, child);
  } else if (child.computed) {
    const placeholder = createElement("span");
    const newState = new Signal(placeholder);
    if (val instanceof Node) newState.value = val;
    child.subscribe((newVal: any) => {
      if (
        typeof newVal === "boolean" ||
        newVal === null ||
        newVal === undefined
      )
        newState.set(placeholder);
      if (newVal instanceof Node) newState.set(newVal);
    });
    appendChild(parent, newState.get());
  }
}

const childStateHandler = {
  matches: (child) =>
    typeof child === "object" && (child.state || child.computer),
  handler: (parent, child, ...args) => handleStateTypes(parent, child, ...args),
};

addAppendChildHook(childStateHandler);

const compAttrSub = (o) => o.elm.setAttribute(o.key, o.computer(o.deps));
const attrSub = (o) => o.elm.setAttribute(o.key, o.newVal);
const attributeStateHandler = {
  matches: (_attrs, key, attrVal) =>
    // skip if useInputs has been called and this is a value or checked attribute
    !(handleInputValue && (key === "value" || key === "checked")) &&
    (attrVal.state || attrVal.computer),
  handler: (elm, key, attrVal) => {
    if (attrVal.computer) {
      const { computer, deps } = attrVal;
      elm.setAttribute(key, computer(deps));
      const depsLen = deps.length;
      for (let i = 0; i < depsLen; i++) {
        deps[i].subscribe(
          { funcRef: compAttrSub, obj: { elm, key, computer, deps } },
          { elm }
        );
      }
    } else {
      elm.setAttribute(key, attrVal.get());
      attrVal.subscribe({ funcRef: attrSub, obj: { elm, key } }, { elm });
    }
  },
};

addAttributeHandler(attributeStateHandler);

const textNodeSub = (o) => (o.txtNode.nodeValue = o.newVal.toString());
function handleTextNode(parent: any, child: any, ...args: any[]) {
  const val = child.get();
  const txtNode = createTextNode(val.toString());
  if (typeof val === "string") child.value = txtNode;
  child.subscribe(
    { funcRef: textNodeSub, obj: { txtNode, newVal: val.toString() } },
    {
      elm: parent,
    }
  );
  appendChild(parent, txtNode, ...args);
}

addAfterRenderHook(() => {
  subscFunctionsArr.forEach((func: any) => {
    func.stateObj.subs.set(func, true);
    if (typeof func === "object") {
      func.funcRef(func.obj);
    } else {
      func(func.stateObj.get());
    }
  });
  subscFunctionsArr = [];
});

const addChildren = (values: any, parentNode) => {
  if (values === undefined) return;
  values = values instanceof Element ? [values] : values;
  const len = values.length;
  let nextNode = parentNode;
  for (let i = 0; i < len; i++) {
    const elm = values[i].elmRef || values[i];
    if (!(nextNode.nextSibling === (elm[0] || elm))) {
      elm.insertNodeBefore = nextNode;
      appendChild(nextNode, elm, true);
    }

    if (elm instanceof Signal) {
      nextNode = isArray(elm.value) ? elm.value.at(-1) : elm.value;
    } else {
      nextNode = isArray(elm) ? elm.at(-1) : elm;
    }
  }
};

const remPlaceHolder = createElement("span");
const removeStaleChildren = (parentNode, endNode, parent, child) => {
  const values = child.value instanceof Element ? [child.value] : child.value;
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
  const childElm = values[0].elmRef || values[0];
  const childLen = childElm.length || 1;
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
    if (child.previousChildLen === 0) {
      if (parentNode.parentNode)
        parentNode.parentNode.insertBefore(placeHolder, parentNode);

      frac(parentNode);
      frac(endNode);
    }
    removeStaleChildren(parentNode, endNode, parent, child);
    addChildren(newVal, parentNode);
    if (child.previousChildLen === 0) {
      if (placeHolder.parentNode) {
        placeHolder.parentNode.insertBefore(frag, placeHolder);
      } else {
        parent.appendChild(frag);
      }
    }
    child.previousChildLen = child.value.length;
    placeHolder.remove();
  });

  child.previousChildLen = child.value.length;
  addChildren(child.value, parentNode);

  if (child.insertNodeBefore) {
    appendChild(child.insertNodeBefore, frag, true);
  } else {
    parent.appendChild(frag);
  }
};

const childArrayStateHandler = {
  matches: (child) => isArray(child.value) && child.state,
  handler: (parent, child) => handleArray(parent, child),
};

addAppendChildHook(childArrayStateHandler);

export function getVal<T>(signal: T): T {
  return (signal as any).value;
}
