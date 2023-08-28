import { getObjVal, setObjVal } from "./objectFromPathString";

function getFormData(form: any): any {
  const namedElements = Array.from(
    form.querySelectorAll("[name]")
  ) as HTMLInputElement[];
  const return_data = {};
  for (const elm of namedElements) {
    const path = elm.getAttribute("name") || "";
    const { val, skip } = getValue(elm);
    if (skip) continue;
    setObjVal(return_data, path, val);
  }
  return return_data;
}

function getValue(elm: HTMLInputElement) {
  if (elm.type === "radio" && elm.checked) return { val: elm.id || elm.value };
  if (elm.type === "radio" && !elm.checked) return { skip: true };
  if (elm.type === "checkbox") return { val: elm.checked };
  if (elm.type === "number") return { val: +elm.value };
  if (elm.value) return { val: elm.value };
  return { val: "" };
}

function setValue(elm: HTMLInputElement, val: any) {
  const radioVal = elm.id || elm.value;
  if (elm.type === "radio" && val === radioVal) return (elm.checked = true);
  if (elm.type === "radio" && val !== radioVal) return (elm.checked = false);
  if (elm.type === "checkbox") return (elm.checked = !!val);
  elm.value = val;
}

interface setFormDataOptions {
  skipChangeEvent?: boolean;
  skipUnsetProperties?: boolean;
}

function setFormData(form: any, data: any, opts: setFormDataOptions = {}) {
  const namedElements = Array.from(
    form.querySelectorAll("[name]")
  ) as HTMLInputElement[];
  for (const elm of namedElements) {
    const path = elm.getAttribute("name") || "";
    const val = getObjVal(data, path);

    if (opts.skipUnsetProperties && (val === null || val === undefined))
      continue;

    if (
      (elm as any).originalValue !== undefined &&
      (elm as any).originalValue === val
    )
      continue;
    setValue(elm, val || "");
    (elm as any).originalValue = val;
    const evtInput = new Event("input", { bubbles: true });
    const evtChange = new Event("change", { bubbles: true });
    !opts.skipChangeEvent && elm.dispatchEvent(evtInput);
    !opts.skipChangeEvent && elm.dispatchEvent(evtChange);
  }
}

// eslint-disable-next-line import/no-unused-modules
export { getFormData, setFormData };
