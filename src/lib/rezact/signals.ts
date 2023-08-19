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
} from "./rezact";

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
      func.obj.newVal = func.stateObj.getValue();
      func.funcRef(func.obj);
    } else {
      func(func.stateObj.getValue());
    }
    batchSubs.splice(i, 1);
    console.debug((window as any).totalSubscriberCount++);
  }

  const batchUnsubsLen = batchUnsubs.length - 1;
  for (let idx = batchUnsubsLen; idx > -1; idx--) {
    const unsub = batchUnsubs[idx];
    if (!unsub.elm.isConnected) {
      unsub.func.stateObj.subs.delete(unsub.func);
      batchUnsubs.splice(idx, 1);
      console.debug((window as any).totalSubscriberCount--);
    }
  }

  if (batchSubs.length === 0) batchTime = -1;
  resetBatchTimeout();
}
resetBatchTimeout();

let subscFunctionsArr: any = [];
console.debug(((window as any).totalSubscriberCount = 0));

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

export class BaseState {
  state = true;
  value: any = null;
  subs: any = new Map();
  computed: any;
  deps: any;
  elmRef: any;
  idxState: any;
  func: any;

  constructor(st: any) {
    this.value = st === null ? "" : st;
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

  getValue() {
    if (this.value instanceof Text) return this.value.textContent;
    return this.value;
  }

  setValue(newVal: any) {
    const val = this.getValue();

    if (newVal === val && !isArray(newVal)) return;

    if (
      val instanceof Element &&
      newVal instanceof Element &&
      val !== newVal &&
      val.parentNode
    )
      val.replaceWith(newVal);

    if (this.value instanceof Text) {
      this.value.textContent = newVal;
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
    }

    return;
  }
}

const computeSub = (obj) => obj.newState.setValue(obj.func(obj.deps));

export function createComputed(func: (obj: any) => {}, deps: any[]) {
  const newState: any = new BaseState(func(deps));
  newState.computed = true;
  const depsLen = deps.length;
  for (let i = 0; i < depsLen; i++) {
    deps[i].subscribe({ funcRef: computeSub, obj: { newState, func, deps } });
  }
  return newState;
}

export function createComputedAttribute(func: (obj: any) => {}, deps: any[]) {
  return { computer: func, deps };
}

const textTypes = { string: true, number: true };
function handleStateTypes(parent: any, child: any) {
  const val = child.getValue();
  if (textTypes[typeof val]) {
    handleTextNode(parent, child);
  } else if (val instanceof Node && !child.computed) {
    appendChild(parent, val);
  } else if (child.computed) {
    const placeholder = createElement("span");
    const newState = new BaseState(placeholder);
    if (val instanceof Node) newState.value = val;
    child.subscribe((newVal: any) => {
      if (typeof newVal === "boolean") newState.setValue(placeholder);
      if (newVal instanceof Node) newState.setValue(newVal);
    });
    appendChild(parent, newState.getValue());
  }
}

const childStateHandler = {
  matches: (child) =>
    typeof child === "object" && (child.state || child.computer),
  handler: (parent, child) => handleStateTypes(parent, child),
};

addAppendChildHook(childStateHandler);

const compAttrSub = (o) => o.elm.setAttribute(o.key, o.computer(o.deps));
const attrSub = (o) => o.elm.setAttribute(o.key, o.newVal);
const attributeStateHandler = {
  matches: (_attrs, _key, attrVal) => attrVal.state || attrVal.computer,
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
      elm.setAttribute(key, attrVal.value);
      attrVal.subscribe({ funcRef: attrSub, obj: { elm, key } }, { elm });
    }
  },
};

addAttributeHandler(attributeStateHandler);

const textNodeSub = (o) => (o.txtNode.textContent = o.newVal.toString());
function handleTextNode(parent: any, child: any) {
  const val = child.getValue();
  const txtNode = createTextNode(val.toString());
  if (typeof val === "string") child.value = txtNode;
  child.subscribe(
    { funcRef: textNodeSub, obj: { txtNode, newVal: val.toString() } },
    {
      elm: parent,
    }
  );
  appendChild(parent, txtNode);
}

addAfterRenderHook(() => {
  subscFunctionsArr.forEach((func: any) => func());
  subscFunctionsArr = [];
});
