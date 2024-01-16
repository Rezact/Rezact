let createElement,
  createElementNS,
  createTextNode,
  createComment,
  createDocumentFragment;
if (typeof window === "object") {
  createElement = document.createElement.bind(document);
  createElementNS = document.createElementNS.bind(document);
  createTextNode = document.createTextNode.bind(document);
  createComment = document.createComment.bind(document);
  createDocumentFragment = document.createDocumentFragment.bind(document);
}

const xlmns = "http://www.w3.org/2000/svg";
export { createElement, createTextNode, createComment, createDocumentFragment };
export const isArray = Array.isArray;

export let createComponent = (tagName, attributes = null) =>
  tagName(attributes);

export const setCreateCompFunc = (func) => (createComponent = func);

const preCreateComponentHooks = [];
export const addPreCreateComponentHook = (item) =>
  preCreateComponentHooks.push(item);

const postCreateComponentHooks = [];
export const addPostCreateComponentHook = (item) =>
  postCreateComponentHooks.push(item);

export function xCreateElement(tagName, attributes, ...children) {
  if (tagName === xFragment) {
    (children as any).rezactFragment = true;
    return children;
  }
  if (typeof tagName === "function") {
    attributes = attributes || {};
    attributes.children = attributes.children || children;

    const hookContext = {};
    preCreateComponentHooks.forEach((func) =>
      func(tagName, attributes, hookContext)
    );
    const newComp = createComponent(tagName, attributes);
    postCreateComponentHooks.forEach((func) =>
      func(newComp, tagName, attributes, hookContext)
    );

    return newComp;
  }
  let elm = null;
  if (["svg", "path", "g", "circle", "rect"].includes(tagName)) {
    elm = createElementNS(xlmns, tagName);
  } else {
    elm = createElement(tagName);
  }
  if (attributes) handleAttributes(elm, attributes);
  const childLen = children.length;
  for (let i = 0; i < childLen; i++) {
    appendChild(elm, children[i]);
  }
  return elm;
}

export let attributeHandlers = [];

export const addAttributeHandler = (item) => attributeHandlers.unshift(item);

const attributeInputValueHandler = {
  matches: (_attrs, key, attrVal) =>
    key === "ref" && attrVal && typeof attrVal === "object",
  handler: (elm, _key, attrVal) => handleRef(elm, attrVal),
};

addAttributeHandler(attributeInputValueHandler);

function handleRef(elm, attrVal) {
  attrVal.elm = elm;
}

const skipEvents = new Set(["onMount", "onUnmount"]);
function handleAttributes(elm, attrs) {
  const keys = Object.keys(attrs);
  const keyLen = keys.length;
  outer: for (let i = 0; i < keyLen; i++) {
    const key = keys[i];
    const attrVal = attrs[key];
    if (
      key.startsWith("on") &&
      typeof attrVal === "function" &&
      !skipEvents.has(key)
    ) {
      elm.addEventListener(key.slice(2).toLowerCase(), attrVal);
      continue;
    }
    if (typeof attrVal === "boolean" && attrVal) {
      elm.setAttribute(key, "");
      continue;
    }

    if (attrVal === null || attrVal === undefined) continue;

    const attrHandlerLen = attributeHandlers.length;
    for (let x = 0; x < attrHandlerLen; x++) {
      const hook = attributeHandlers[x];
      if ((hook.matches as any)(attrs, key, attrVal)) {
        (hook.handler as any)(elm, key, attrVal, attrs);
        continue outer;
      }
    }

    elm.setAttribute(key, attrVal);
  }
}

export const childArrayHandler: any = {
  matches: (child) => isArray(child),
  handler: (parent, child, insertAfter, removeElm) => {
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
  },
};

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
  if (parentNode.nodeName === "#text" && !insertAfter) {
    // debugger;
    throw "Cannot append to text node";
  }
  // console.log({ parentNode, childNode, insertAfter });
  insertAfter
    ? insertNodeAfter(parentNode, childNode)
    : parentNode.appendChild(childNode);
}

export const childNodeHandler: any = {
  matches: (child) => child instanceof Node,
  handler: (parent, child, insertAfter, removeElm) =>
    appendChildNode(parent, child, insertAfter, removeElm),
};

let appendChildHooks: any = [childArrayHandler, childNodeHandler];

export const addAppendChildHook = (item) => appendChildHooks.unshift(item);

export let appendChild = (parent, child, ...args) => {
  const appendChildHookLen = appendChildHooks.length;
  if (
    typeof child === "undefined" ||
    child === null ||
    typeof child === "boolean"
  )
    return;

  for (let i = 0; i < appendChildHookLen; i++) {
    const hook = appendChildHooks[i];
    if ((hook.matches as any)(child))
      return (hook.handler as any)(parent, child, ...args);
  }

  parent.appendChild(createTextNode(String(child)));
};

const afterRenderHooks = [];
export const addAfterRenderHook = (item) => afterRenderHooks.push(item);

export function render(root, tagName, attributes: any = {}) {
  const elm = createComponent(tagName, attributes);
  if (root.state) {
    const frag = document.createDocumentFragment();
    appendChild(frag, elm);
    root.set([...frag.childNodes]);
  } else {
    root.innerHTML = "";
    appendChild(root, elm);
  }
  afterRenderHooks.forEach((func) => func());
  if (location.hash) {
    const elm = document.querySelector(location.hash);
    setTimeout(() => {
      if (elm && elm.scrollIntoView)
        elm.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "start",
        });
    }, 100);
  }
}
export const xFragment = [];

let contextUsed = false;
export function useContext() {
  if (contextUsed) return;
  contextUsed = true;

  preCreateComponentHooks.push((_tagName, attributes, hookContext) => {
    attributes.setContext = (key, context) => {
      if (!hookContext.componentContext) hookContext.componentContext = {};
      hookContext.componentContext[key] = context;
    };

    attributes.getContext = (key) => {
      let currentElement = hookContext.contextRoot;

      while (currentElement.parentNode) {
        currentElement = currentElement.parentNode;

        if (
          currentElement.firstChild &&
          currentElement.firstChild.rezactContext &&
          currentElement.firstChild.rezactContext[key]
        ) {
          return currentElement.firstChild.rezactContext[key];
        }

        if (currentElement.rezactContext && currentElement.rezactContext[key]) {
          return currentElement.rezactContext[key];
        }
      }

      return undefined;
    };
  });

  postCreateComponentHooks.push(
    (newComp, _tagName, _attributes, hookContext) => {
      hookContext.contextRoot = newComp[0] || newComp;
      hookContext.contextRoot.rezactContext = hookContext.componentContext;
    }
  );
}

export let handleInputValue = null;
export function useInputs() {
  if (handleInputValue) return;
  handleInputValue = true;
  function getInputVal(elm: HTMLInputElement) {
    const radioVal = elm.value || elm.id;
    if (elm.type === "radio" && elm.checked) return radioVal;
    if (elm.type === "radio" && !elm.checked) return "";
    if (elm.type === "checkbox") return elm.checked;
    if (elm.type === "number") return +elm.value;
    if (elm.value) return elm.value;
    return "";
  }

  function setInputVal(elm: any, val: any) {
    const radioVal = elm.value || elm.id;
    if (elm.type === "radio" && val === radioVal) return (elm.checked = true);
    if (elm.type === "radio" && val !== radioVal) return (elm.checked = false);
    if (elm.type === "checkbox") return (elm.checked = !!val);
    elm.value = val.nodeValue || val;
  }

  const handleInputAttr = (element, attributeValue, attributes) => {
    setInputVal(element, attributeValue.get());

    attributeValue.subscribe(
      (newVal: string) => {
        if (element.value === newVal) return;
        setInputVal(element, newVal);
      },
      { elm: element }
    );

    if (
      !Object.keys(attributes).includes("onChange") &&
      !Object.keys(attributes).includes("onInput")
    ) {
      const inpEvType = element.type === "text" || element.type === "number";
      const evType = inpEvType ? "input" : "change";
      element.addEventListener(evType, () => {
        attributeValue.set(getInputVal(element));
      });
    }
  };

  const attributeInputValueHandler = {
    matches: (_attrs, key, attrVal) =>
      (key === "value" && attrVal.state) ||
      (key === "checked" && attrVal.state),
    handler: (elm, _key, attrVal, attrs) =>
      handleInputAttr(elm, attrVal, attrs),
  };

  addAttributeHandler(attributeInputValueHandler);
}

let usingLifeCycleAttrs = false;
export function useLifeCycleAttributes() {
  if (usingLifeCycleAttrs) return;
  usingLifeCycleAttrs = true;

  const onMountHandler = (elm, _key, attrVal, _attrs) => {
    const checkMounted = () => {
      if (elm.isConnected) return (elm.rzHasMounted = true) && attrVal(elm);
      setTimeout(checkMounted, 10);
    };
    checkMounted();
  };

  const onMountAttrHandler = {
    matches: (_attrs, key) => key === "onMount",
    handler: onMountHandler,
  };

  const onUnMountAttrHandler = {
    matches: (_attrs, key) => key === "onUnmount",
    handler: (elm, _key, attrVal, attrs) => {
      if (!attrs.onMount) onMountHandler(elm, _key, () => {}, attrs);

      const checkMounted = () => {
        if (elm.rzHasMounted && !elm.isConnected) return attrVal(elm);
        setTimeout(checkMounted, 100);
      };
      checkMounted();
    },
  };

  addAttributeHandler(onMountAttrHandler);
  addAttributeHandler(onUnMountAttrHandler);
}
