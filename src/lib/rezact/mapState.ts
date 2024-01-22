import { Signal, afterSignalRenderHook, effect } from "./signals";
import { inRender, createComponent, isArray } from ".";

function isIgnoredInstance(obj: any): boolean {
  return (
    obj instanceof Window ||
    obj instanceof Document ||
    obj instanceof HTMLElement ||
    obj instanceof Node
  );
}

const skipKeys = new Set([
  "elmRef",
  "idxState",
  "deps",
  "subs",
  "func",
  "associatedState",
  "state",
  "computed",
]);

function findNestedStates(obj, results = []) {
  if (isIgnoredInstance(obj)) return [];

  // Check if the input is an object
  if (typeof obj === "object" && obj !== null) {
    // If it's an array, iterate over each element
    if (Array.isArray(obj)) {
      for (let item of obj) {
        findNestedStates(item, results);
      }
    } else {
      // If it's an object, iterate over each property
      for (let key in obj) {
        if (key.startsWith("$")) {
          results.push(obj[key]);
        }
        if (skipKeys.has(key)) continue;
        if (isIgnoredInstance(obj[key])) continue;

        findNestedStates(obj[key], results);
      }
    }
  }
  return results;
}

function subscribeToNestedStates(item, mapStateObj) {
  const nestedStates = findNestedStates(item);
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

export class MapSignal<T> extends Signal<T> {
  elmRefCache: any = new Map();
  refreshTimer: any;
  clearCacheTimer: any;
  push: (...items: T[]) => {};
  map: (
    callbackfn: (value: T, index: number, array: T[]) => unknown,
    thisArg?: any
  ) => {};

  constructor(st: T[]) {
    super(st as T);
    ["push", "pop", "splice", "shift", "unshift", "reduce", "map"].forEach(
      (item) => {
        this[item] = (...args) => {
          this.value[item](...args);
          this.makeChildrenSignals();
          this.updateList(this.func);
          this.alertSubs(this.value);
          if (!inRender) afterSignalRenderHook();
        };
      }
    );
    this.makeChildrenSignals();
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

  makeChildrenSignals() {
    if (!this.value) return;
    const len = this.value.length;
    for (let idx = 0; idx < len; idx++) {
      let item = this.value[idx];
      if (!item.state) this.value[idx] = item = new Signal(item);
      item.__private_idx = idx;

      if (!item.nestedSubscribed) {
        subscribeToNestedStates(item, this);
      }
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

  toJSON() {
    return this.value.map((thisVal) => {
      if (typeof thisVal === "object" && !thisVal.state && !thisVal.get)
        return thisVal;
      if (thisVal.toJSON) return thisVal.toJSON();
      thisVal.get ? thisVal.get() : thisVal;
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

export const mapEffect = (func, deps) => {
  const computed: any = effect(func, deps);
  computed.deps = deps;
  computed.mapStateObj = false;
  return computed;
};
