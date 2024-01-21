interface CustomInput extends HTMLInputElement {
  errorElm: HTMLElement;
  errorObj: Map<string, boolean>;
}

interface CustomErrorElm extends HTMLElement {
  errorObj?: Map<string, boolean>;
}

interface ValidatorOptions {
  inputElm: CustomInput;
  errorElm?: CustomErrorElm;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  exactLength?: number;
  pattern?: RegExp;
  customValidator?: (value: string) => boolean | string;
  mask?: string;
  maskSlots?: string;
  dataAccept?: RegExp;
  allowUnacceptedChars?: boolean;
  unmaskInputValueProp?: boolean;
  showFullMaskWhileTyping?: boolean;
  hideDotSlots?: boolean;
  validateUnMaskedValue?: boolean;
  validateOnInput?: boolean;
  isNumeric?: boolean;
  customErrorMessages?: {
    isRequired?: string;
    inputNotLongEnough?: string;
    inputLengthTooLong?: string;
    patternNotValid?: string;
    customNotValid?: string;
  };
}

// a deduplicated list of all the inputs and errorElements that are registered by setupInput
const inputElms = new Map();
const errorElms = new Map();

const keyDownEvent = "keydown";
const inputEvent = "input";
const blurEvent = "blur";
const clickEvent = "click";
const focusEvent = "focus";

function setupValidatorInput(opts: ValidatorOptions) {
  opts.inputElm = getInputElm(opts) as CustomInput;
  opts.errorElm = getErrorElm(opts);

  const inputElm = opts.inputElm;
  if (inputElms.has(inputElm))
    return console.error(
      `${inputElm.name} - This input has already been setup. If you would like to make changes to the options you can access them directly on the [element].validatorOptions.`
    );

  opts.errorElm = opts.errorElm || createErrorElementForInput(inputElm);
  opts = mergeDefaultOptions(opts);
  console.info(
    "validating validator options for",
    opts.inputElm,
    validateOptions(opts)
  );
  setupOptionPropertyGettersAndSetters(opts);

  const errorElm = opts.errorElm;
  const form = inputElm.form;

  inputElm.errorElm = errorElm as HTMLElement;

  inputElms.set(inputElm, opts);
  errorElms.set(errorElm, opts);
  errorElm.errorObj = new Map();

  if (opts.mask) VMasker(inputElm);
  if (!opts.mask) setupValueProxy(inputElm);

  addEventListener(inputElm, blurEvent, onBlur);
  addEventListener(inputElm, inputEvent, onInput);
  addEventListener(inputElm, keyDownEvent, onKeyDown);

  !form.zwcSubmitValidation && addEventListener(form, "submit", onSubmit, true);
  form.zwcSubmitValidation = true;
  form.noValidate = true; //disable browser validation, we got it from here
}

function addEventListener(elm, event, func, opts = {}) {
  elm.addEventListener(event, func, opts);
}

function ObjectDefineProperty(obj, propName, opts) {
  return Object.defineProperty(obj, propName, opts);
}

function ObjectGetOwnPropertyDescriptor(proto, propName) {
  return Object.getOwnPropertyDescriptor(proto, propName);
}

function setupValueProxy(inputElm) {
  var valueProp = ObjectGetOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    "value"
  );
  const setVal = (newValue) => valueProp.set.call(inputElm, newValue);
  const getVal = () => valueProp.get.call(inputElm);

  ObjectDefineProperty(inputElm, "value", {
    get: getVal,
    set: (newValue) => {
      setVal(newValue);
      const blurEv = new Event(blurEvent);
      inputElm.dispatchEvent(blurEv);
    },
  });
}

function querySel(selector) {
  return document.querySelector(selector);
}

function getInputElm(opts) {
  if (typeof opts.inputElm === "function") return opts.inputElm(opts);
  if (typeof opts.inputElm === "string") return querySel(opts.inputElm);
  return opts.inputElm as HTMLInputElement;
}

function getErrorElm(opts) {
  if (typeof opts.errorElm === "function") return opts.errorElm(opts);
  if (typeof opts.errorElm === "string") return querySel(opts.errorElm);
  return opts.errorElm as HTMLElement;
}

function mergeDefaultOptions(opts) {
  const accept = new RegExp(opts.dataAccept || "[\\d\\w]", "g");
  const testString = `abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ 1234567890 !@#$%^&*()_+-=[]\;',./{}|:"<>?`;
  const matchedChars = testString.match(accept);

  const defaults = {
    inputElm: null,
    errorElm: null,
    required: false,
    minLength: null,
    maxLength: null,
    exactLength: null,
    pattern: null,
    customValidator: null,
    mask: null,
    maskSlots: null,
    dataAccept: null,
    allowUnacceptedChars: false,
    unmaskInputValueProp: false,
    showFullMaskWhileTyping: false,
    hideDotSlots: true,
    validateUnMaskedValue: true,
    validateOnInput: true,
    isNumeric: opts.dataAccept && matchedChars.length === 10,
    customErrorMessages: {
      isRequired: null,
      inputNotLongEnough: null,
      inputLengthTooLong: null,
      patternNotValid: null,
    },
  };

  return { ...defaults, ...opts };
}

function setupOptionPropertyGettersAndSetters(opts) {
  opts.inputElm.mask = opts.mask;
  opts.inputElm.maskSlots = opts.maskSlots;
  opts.inputElm.dataAccept = opts.dataAccept;
  opts.inputElm.unmaskInputValueProp = opts.unmaskInputValueProp;
  opts.inputElm.showFullMaskWhileTyping = opts.showFullMaskWhileTyping;
  opts.inputElm.hideDotSlots = opts.hideDotSlots;
  opts.inputElm.validatorOptions = opts;

  const proxyOption = (prop) =>
    ObjectDefineProperty(opts.inputElm.validatorOptions, prop, {
      get: () => opts.inputElm[prop],
      set: (newValue) => (opts.inputElm[prop] = newValue),
    });

  const optionsToProxy = [
    "mask",
    "maskSlots",
    "dataAccept",
    "unmaskInputValueProp",
    "showFullMaskWhileTyping",
    "hideDotSlots",
  ];

  optionsToProxy.forEach((prop) => proxyOption(prop));
}

function validateOptions(opts) {
  if (!opts.inputElm) throw `inputElm is a required option`;
  if (opts.inputElm.nodeName !== `INPUT`)
    throw `inputElm must be an INPUT element`;

  const name = opts.inputElm.name;
  const prefix = ` - ${name} - invalid config - `;

  if (!name) {
    console.error("No name attribute given on input", opts.inputElm);
    throw `${prefix} Please give your input a name attribute`;
  }

  if (!(opts.errorElm instanceof HTMLElement))
    throw `${prefix} errorElm must be an HTML Element`;

  if (opts.mask && !opts.maskSlots)
    throw `${prefix} cannot define a mask without defining a maskSlot`;

  if (opts.minLength && opts.exactLength)
    throw `${prefix} cannot define both minLength and exactLength, pick one.`;

  if (opts.maxLength && opts.exactLength)
    throw `${prefix} cannot define both maxLength and exactLength, pick one.`;

  const patternWithoutMinLength =
    opts.pattern &&
    !(opts.minLength || opts.exactLength || !opts.validateOnInput);
  const customWithoutMinLength =
    opts.customValidator &&
    !(opts.minLength || opts.exactLength || !opts.validateOnInput);

  if (patternWithoutMinLength || customWithoutMinLength)
    throw `${prefix} need to define minLength, exactLength, or set validateOnInput: false when using pattern or custom validators.  Otherwise the user will be shown errors immediately as they start typing. This leads to poor UX.  Ideally, we want to give the user a chance to put in the correct input before yelling at them. If your pattern cannot possibly be valid when the input is below a certain length, then we want to wait until that minimum length is met before attempting this validation.`;

  if (opts.mask) {
    const accept = new RegExp(opts.dataAccept || "[\\d\\w]", "g");
    const maskContainsAcceptChars = opts.mask.match(accept) || [];
    if (maskContainsAcceptChars.length > 0)
      throw `${prefix} The 'mask' contains characters that are also able to be typed into the input, please fix the mask or add/correct the 'dataAccept' property to fix this issue`;
  }

  return "success";
}

function onSubmit(ev) {
  const form = ev.target;

  checkAll(ev.target);
  const isValid = form.checkValidity();
  if (!isValid) return ev.preventDefault();
  // return isValid;
  // if (isValid) alert("Form is Valid!");
  // ev.preventDefault();
}

function onBlur(ev) {
  const inputElm = ev.target;
  if (requiredValidationActive(inputElm)) return reportRequired(inputElm);
  if (getValue(inputElm) === "") return clearValidationError(inputElm);
  if (inputContainsUnacceptedChars(inputElm))
    return reportPatternNotValid(inputElm);
  if (inputNotLongEnough(inputElm)) return reportNotLongEnough(inputElm);
  if (inputLengthTooLong(inputElm)) return reportLengthTooLong(inputElm);
  if (patternNotValid(inputElm)) return reportPatternNotValid(inputElm);
  if (customNotValid(inputElm)) return reportCustomNotValid(inputElm);
  clearValidationError(inputElm);
}

function onKeyDown(ev) {
  const inputElm = ev.target;
  const opts = inputElms.get(inputElm);
  if (opts.mask) return; // the mask handles what data to accept, no need to do it here;
  if (!opts.dataAccept) return; // only intercept if dataAccept is explicitly set
  if (opts.allowUnacceptedChars) return;
  const allowedKeys = ["Backspace", "Tab", "ArrowRight", "ArrowLeft"];
  if (allowedKeys.includes(ev.key)) return;

  const accept = new RegExp(opts.dataAccept);
  const keyNotAccepted = !accept.test(ev.key);
  if (keyNotAccepted) return ev.preventDefault();
}

function onInput(ev) {
  const inputElm = ev.target;
  const opts = inputElms.get(inputElm);
  if (!opts.validateOnInput && inputElm.checkValidity()) return;
  if (requiredValidationActive(inputElm)) return reportRequired(inputElm);
  if (getValue(inputElm) === "") return clearValidationError(inputElm);
  if (inputContainsUnacceptedChars(inputElm))
    return reportPatternNotValid(inputElm);
  if (inputNotLongEnough(inputElm)) return;
  if (inputLengthTooLong(inputElm)) return reportLengthTooLong(inputElm);
  if (patternNotValid(inputElm)) return reportPatternNotValid(inputElm);
  if (customNotValid(inputElm)) return reportCustomNotValid(inputElm);
  clearValidationError(inputElm);
}

function checkAll(formElm) {
  const allInputs = Array.from(formElm.querySelectorAll("input"));
  allInputs.forEach((inputElm) => {
    const opts = inputElms.get(inputElm);
    if (!opts) return;
    if (isRequired(inputElm)) return reportRequired(inputElm);
    if (inputContainsUnacceptedChars(inputElm))
      return reportPatternNotValid(inputElm);
    if (inputNotLongEnough(inputElm)) return reportNotLongEnough(inputElm);
    if (inputLengthTooLong(inputElm)) return reportLengthTooLong(inputElm);
    if (patternNotValid(inputElm)) return reportPatternNotValid(inputElm);
    if (customNotValid(inputElm)) return reportCustomNotValid(inputElm);
    if (nativeNotValid(inputElm)) return reportNativeNotValid(inputElm);
    clearValidationError(inputElm);
  });
}

function getValue(inputElm) {
  const opts = inputElms.get(inputElm);

  const unmaskedValue =
    typeof inputElm.unmaskedValue === "string"
      ? inputElm.unmaskedValue
      : inputElm.value;

  const maskedValue =
    typeof inputElm.maskedValue === "string"
      ? inputElm.maskedValue
      : inputElm.value;

  return opts.validateUnMaskedValue ? unmaskedValue : maskedValue;
}

function isRequired(inputElm) {
  const opts = inputElms.get(inputElm);
  if (!opts.required) return false;
  const inputVal = opts.mask ? inputElm.unmaskedValue : inputElm.value;
  if (inputVal.trim().length === 0) return true;
  return false;
}

function reportRequired(inputElm) {
  const opts = inputElms.get(inputElm);
  const customMsg = opts.customErrorMessages.isRequired;
  if (customMsg) return setErrorMessage(inputElm, customMsg);

  inputElm.requiredValidationActive = true;
  inputElm.failedRequiredValidationOnce = true;
  const label = inputElm.labels[0]?.innerText || "This field";
  const msg = `${label} is required.`;
  setErrorMessage(inputElm, msg);
}

function requiredValidationActive(inputElm) {
  if (!inputElm.failedRequiredValidationOnce) return false;
  const opts = inputElms.get(inputElm);
  const inputVal = opts.mask ? inputElm.unmaskedValue : inputElm.value;
  if (inputVal.length < 1) return true;

  if (!inputElm.requiredValidationActive) return false;
  inputElm.requiredValidationActive = false;
  clearValidationError(inputElm);
  return false;
}

function inputContainsUnacceptedChars(inputElm) {
  const opts = inputElms.get(inputElm);
  if (!opts.dataAccept) return false;
  const valSplit = getValue(inputElm).split("");
  const accept = new RegExp(opts.dataAccept);

  for (const char of valSplit) {
    const keyNotAccepted = !accept.test(char);
    if (keyNotAccepted) return true;
  }

  if (inputElm.patternValidationActive) clearValidationError(inputElm);
  inputElm.patternValidationActive = false;
  return false;
}

function inputNotLongEnough(inputElm) {
  const opts = inputElms.get(inputElm);
  if (!opts.minLength && !opts.exactLength) return false;

  const inpVal = getValue(inputElm);

  const tooLongActive = inputElm.inputTooLongErrorActive;
  const maxLen = opts.maxLength || opts.exactLength;
  if (tooLongActive && inpVal.length <= maxLen) {
    inputElm.inputTooLongErrorActive = false;
    clearValidationError(inputElm);
  }

  if (opts.minLength && inpVal.length < opts.minLength) return true;

  if (opts.exactLength && inpVal.length < opts.exactLength) return true;

  return false;
}

function reportNotLongEnough(inputElm) {
  const opts = inputElms.get(inputElm);
  const customMsg = opts.customErrorMessages.inputNotLongEnough;
  if (customMsg) return setErrorMessage(inputElm, customMsg);

  const label = inputElm.labels[0]?.innerText || "This field";
  const n = opts.minLength;
  const x = opts.exactLength;
  const m = opts.maxLength;
  const exact = opts.exactLength || m === n;
  const exactOrAtleast = exact ? "exactly" : "atleast";
  const chars = opts.isNumeric ? "digits" : "characters";
  const msg = `${label} must be ${exactOrAtleast} ${n || x} ${chars} long.`;
  setErrorMessage(inputElm, msg);
}

function inputLengthTooLong(inputElm) {
  const opts = inputElms.get(inputElm);
  const maxLen = opts.maxLength || opts.exactLength;
  if (!maxLen) return false;

  const inpVal = getValue(inputElm);
  if (inpVal.length > maxLen) {
    inputElm.inputTooLongErrorActive = true;
    return true;
  }

  return false;
}

function reportLengthTooLong(inputElm) {
  const opts = inputElms.get(inputElm);
  if (opts.exactLength) return reportNotLongEnough(inputElm);
  const maxLen = opts.maxLength;
  const customMsg = opts.customErrorMessages.inputLengthTooLong;
  if (customMsg) return setErrorMessage(inputElm, customMsg);

  const label = inputElm.labels[0]?.innerText || "This field";
  const chars = opts.isNumeric ? "digits" : "characters";
  const msg = `${label} must not be longer than ${maxLen} ${chars}.`;
  setErrorMessage(inputElm, msg);
}

function patternNotValid(inputElm) {
  const opts = inputElms.get(inputElm);
  if (!opts.pattern) return false;
  const val = inputElm.value;
  const re = new RegExp(opts.pattern);
  return !re.test(val);
}

function reportPatternNotValid(inputElm) {
  const opts = inputElms.get(inputElm);
  const customMsg = opts.customErrorMessages.patternNotValid;
  if (customMsg) return setErrorMessage(inputElm, customMsg);

  inputElm.patternValidationActive = true;
  const label = inputElm.labels[0]?.innerText || "This field";
  const msg = `${label} is not valid.`;
  setErrorMessage(inputElm, msg);
}

function customNotValid(inputElm) {
  const opts = inputElms.get(inputElm);
  if (!opts.customValidator) return false;

  const test = opts.customValidator(getValue(inputElm));
  if (typeof test === "string") {
    opts.customErrorMessages.customNotValid = test;
    return true; //input is not valid is true
  }
  return !test;
}

function reportCustomNotValid(inputElm) {
  const opts = inputElms.get(inputElm);
  const customMsg = opts.customErrorMessages.customNotValid;
  if (customMsg) return setErrorMessage(inputElm, customMsg);

  const label = inputElm.labels[0]?.innerText || "This field";
  const msg = `${label} is not valid.`;
  setErrorMessage(inputElm, msg);
}

function nativeNotValid(inputElm) {
  return !inputElm.checkValidity();
}

function reportNativeNotValid(inputElm) {
  const opts = inputElms.get(inputElm);
  const customMsg = opts.customErrorMessages.nativeNotValid;
  if (customMsg) return setErrorMessage(inputElm, customMsg);
  console.log("nativeNotValid", inputElm.validationMessage);
  if (inputElm.validationMessage)
    return setErrorMessage(inputElm, inputElm.validationMessage, true);

  const label = inputElm.labels[0]?.innerText || "This field";
  const msg = `${label} is not valid.`;
  setErrorMessage(inputElm, msg);
}

function openErrorElm(errorElm) {
  errorElm.style.height = errorElm.scrollHeight + "px";
}

function closeErrorElm(errorElm) {
  errorElm.style.height = "0px";
}

function clearValidationError(inputElm, skipSet = false) {
  const currentErrorMsg = inputElm.validationMessage;
  inputElm.classList.remove("invalid");
  inputElm.setCustomValidity("");

  const errorElm = inputElm.errorElm;
  errorElm.errorObj.delete(currentErrorMsg);
  !skipSet && setErrorMessages(errorElm);
}

function setErrorMessage(inputElm, msg, native = false) {
  if (!native) {
    clearValidationError(inputElm, true);
    if (inputElm.validationMessage === msg) return;
  }

  inputElm.classList.add("invalid");
  inputElm.setCustomValidity(msg);

  const errorElm = inputElm.errorElm;
  errorElm.errorObj.set(msg, true);
  setErrorMessages(errorElm);
}

let showErrorDeBounce = null;
function setErrorMessages(errorElm) {
  let messages = Array.from(errorElm.errorObj.keys()).join("\n");
  errorElm.innerText = messages;

  clearTimeout(showErrorDeBounce);
  showErrorDeBounce = setTimeout(showErrors, 100);
}

function showErrors() {
  const allErrorElms = Array.from(errorElms.keys());
  for (const errorElm of allErrorElms) {
    if (!errorElm) continue;
    if (errorElm.errorObj.size === 0) closeErrorElm(errorElm);
    if (errorElm.errorObj.size > 0) openErrorElm(errorElm);
  }
}

function createErrorElementForInput(inputElm) {
  const errorElm = document.createElement("div");
  errorElm.style.height = "0px";
  errorElm.style.overflow = "hidden";
  errorElm.style.transition = "all 300ms";
  errorElm.style.color = "red";
  errorElm.style.fontSize = "10pt";
  errorElm.style.marginBottom = "10px";
  errorElm.classList.add("error-message");
  inputElm.style.marginBottom = "0px";
  inputElm.after(errorElm);
  return errorElm;
}

function VMaskerSetupProperties(el, formatValue) {
  const valueProp = ObjectGetOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    "value"
  );
  const setVal = (newValue) => valueProp.set.call(el, newValue);
  const getVal = () => valueProp.get.call(el);

  ObjectDefineProperty(el, "value", {
    get: function () {
      const unmaskedValue =
        typeof el.unmaskedValue === "string" ? el.unmaskedValue : getVal();

      const maskedValue =
        typeof el.maskedValue === "string" ? el.maskedValue : getVal();

      return el.unmaskInputValueProp ? unmaskedValue : maskedValue;
    },
    set: function (newValue) {
      setVal(formatValue(newValue));
      const blurEv = new Event(blurEvent);
      el.dispatchEvent(blurEv);
    },
  });

  const storedValues = {
    mask: el.mask,
    maskSlots: el.maskSlots,
    dataAccept: el.dataAccept,
  };

  const maskGettersAndSetters = (prop) =>
    ObjectDefineProperty(el, prop, {
      get: () => storedValues[prop],
      set: (newValue) => {
        storedValues[prop] = newValue;
        el.resetVars();
        el.value = el.value;
      },
    });

  const maskProps = ["mask", "maskSlots", "dataAccept"];

  maskProps.forEach((prop) => maskGettersAndSetters(prop));

  return [getVal, setVal] as const;
}

function VMasker(el) {
  let pattern = null;
  let slots = null;
  let accept = null;
  let prev = null;
  let first = null;

  el.resetVars = () => {
    pattern = el.mask || el.getAttribute("placeholder");
    slots = new Set(el.maskSlots || el.dataset.slots || "_");
    accept = new RegExp(el.dataAccept || el.dataset.accept || "[\\d\\w]", "g");

    prev = ((j) =>
      Array.from(pattern, (c, i) => (slots.has(c) ? (j = i + 1) : j)))(0);

    first = [...pattern].findIndex((c) => slots.has(c));
  };

  el.resetVars();

  const clean = (inputReceived) => {
    const unmaskedInput = inputReceived.match(accept) || [];
    const cleanInput = Array.from(pattern, (maskChar) =>
      unmaskedInput[0] === maskChar || slots.has(maskChar)
        ? unmaskedInput.shift() || maskChar
        : maskChar
    );
    el.unmaskedValue = cleanInput?.join("").match(accept)?.join("") || "";
    return cleanInput;
  };

  const formatValue = (value) => {
    const fullMaskValue = clean(value);
    const newFirstSlot = fullMaskValue.findIndex((c) => slots.has(c));
    const showFullMask = el.showFullMaskWhileTyping || newFirstSlot === -1;
    const partialMaskValue =
      newFirstSlot === -1
        ? fullMaskValue
        : fullMaskValue.slice(0, newFirstSlot);

    const newVal = showFullMask ? fullMaskValue : partialMaskValue;
    const slotsToHide = el.hideDotSlots && slots.has(".") ? "." : "";
    const maskedValue = newVal.join("").replaceAll(slotsToHide, "").trim();
    el.fullMaskValue = fullMaskValue
      .join("")
      .replaceAll(slotsToHide, "")
      .trim();
    el.partialMaskValue = partialMaskValue
      .join("")
      .replaceAll(slotsToHide, "")
      .trim();
    el.maskedValue = maskedValue;
    return maskedValue;
  };

  const [getVal, setVal] = VMaskerSetupProperties(el, formatValue);

  const format = () => {
    const [i, j] = [el.selectionStart, el.selectionEnd].map((i) => {
      i = clean(getVal().slice(0, i)).findIndex((c) => slots.has(c));
      const test =
        i < 0 ? prev[prev.length - 1] : back ? prev[i - 1] || first : i;
      return test;
    });

    setVal(formatValue(getVal()));
    el.setSelectionRange(i, j);
    back = false;
  };

  const focusFormat = () => {
    setVal(formatValue(getVal()));
    setTimeout(() => {
      const [i, j] = [el.selectionStart, el.selectionEnd].map((i) => {
        i = clean(getVal().slice(0, i)).findIndex((c) => slots.has(c));
        const test =
          i < 0 ? prev[prev.length - 1] : back ? prev[i - 1] || first : i;
        return test;
      });
      el.setSelectionRange(i, j);
      back = false;
    }, 100);
  };

  let back = false;

  addEventListener(
    el,
    keyDownEvent,
    (e) => (back = e.key === "Backspace"),
    true
  );
  addEventListener(el, inputEvent, format, true);
  addEventListener(el, focusEvent, focusFormat, true);
  addEventListener(el, clickEvent, focusFormat, true);
  addEventListener(
    el,
    blurEvent,
    () => pattern.startsWith(getVal()) && setVal(""),
    true
  );

  // mask any default values already set in the input
  el.value = el.value;

  el.alreadyMasked = true;
}

export { setupValidatorInput };

export type { ValidatorOptions };
