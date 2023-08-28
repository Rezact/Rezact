function getObjVal(obj: any, path: string) {
  if (!obj) return obj;
  const { pathSplit, lastKey } = getPathSplit(path);
  let currentWorkingObject = obj;
  pathSplit.reduce((_thisKey, nextKey) => {
    const thisKey = _thisKey.replaceAll("\\", "");
    currentWorkingObject = currentWorkingObject[thisKey] || {};
    return nextKey;
  });
  return currentWorkingObject[lastKey];
}

function setObjVal(obj: any, path: string, val: any) {
  const { objAtPath, lastKey } = createObjectFromPath(obj, path);
  return val !== undefined ? (objAtPath[lastKey] = val) : objAtPath[lastKey];
}

function createObjectFromPath(obj: any, path: string) {
  let currentWorkingObject = obj;
  const { pathSplit, lastKey } = getPathSplit(path);
  pathSplit.reduce((_thisKey, nextKey) => {
    const thisKey = _thisKey.replaceAll("\\", "");
    make(thisKey)
      .onThe(currentWorkingObject)
      .anObjectOrArrayDependingOn(nextKey);
    currentWorkingObject = currentWorkingObject[thisKey];
    return nextKey;
  });
  return { objAtPath: currentWorkingObject, lastKey };
}

function getPathSplit(path: string) {
  // splits complex path strings like "deeply.nested[9][1][asdf].asdf.0.1.and.even.escaping\\[brackets\\]and\\.periods\\."
  // into ['deeply', 'nested', '9', '1', 'asdf', 'asdf', '0', '1', 'and', 'even', 'escaping\\[brackets\\]and\\.periods\\.']
  const pathSplit = path.split(/\]\[|\]\.|(?<!\\)\[|(?<!\\)\.|(?<!\\)\]/g);
  if (pathSplit.at(-1) === "") pathSplit.pop();
  return { pathSplit, lastKey: pathSplit.at(-1)?.replaceAll("\\", "") || "" };
}

function make(thisKey: string) {
  let currentWorkingObject: any = null;

  const anObjectOrArrayDependingOn = (nextKey: string) => {
    if (currentWorkingObject[thisKey]) return;
    Number.isInteger(Number(nextKey))
      ? (currentWorkingObject[thisKey] = [])
      : (currentWorkingObject[thisKey] = {});
  };

  const onThe = (cwo: any) => {
    currentWorkingObject = cwo;
    return { anObjectOrArrayDependingOn };
  };
  return { onThe };
}

// eslint-disable-next-line import/no-unused-modules
export { getObjVal, setObjVal };
