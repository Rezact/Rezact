import { setupValidatorInput } from "src/lib/rezact/validator";
import type { ValidatorOptions } from "src/lib/rezact/validator";
import { MyLayout } from "../Layout/nestedLayout";
import { getFormData } from "src/lib/rezact/formHelper";

type InputProps = {
  label: string;
  placeholder?: string;
  value?: string;
  type?: string;
};

function Input({ label, placeholder, value, type }: InputProps) {
  const id = label.toLowerCase();
  return (
    <>
      <label for={id}>{label}</label>
      <input
        style="display: block; width: 300px;"
        autocomplete="off"
        name={id}
        id={id}
        type={type || "text"}
        value={value || ""}
        placeholder={placeholder || ""}
      />
      <div style="height: 0px; overflow: hidden; transition: all 300ms ease 0s; color: red; font-size: 10pt; margin-bottom: 10px;"></div>
    </>
  );
}

const SerialInput = <Input label="Serial No." />;
const serialNoInputValidationOptions: ValidatorOptions = {
  inputElm: SerialInput[1],
  errorElm: SerialInput[2],
  required: true,
  mask: "XXX ____ XDX-( ____ )-{ ____ }-[ ____ ]",
  maskSlots: "_",
  dataAccept: /[\d]/,
  unmaskInputValueProp: false,
  validateUnMaskedValue: true,
  showFullMaskWhileTyping: true,
  exactLength: 16,
  customErrorMessages: {
    inputNotLongEnough: "Serial Number is not complete.",
  },
  // showFullMaskWhileTyping: true,
  // hideDotSlots: false
};

const SerialInput2 = <Input label="Serial2 No." />;
const serialNoInputValidationOptions2: ValidatorOptions = {
  inputElm: SerialInput2[1],
  errorElm: SerialInput2[2],
  required: true,
  mask: "XXX ____ XDX-( ____ )-{ ____ }-[ ____ ]",
  maskSlots: "_",
  dataAccept: /[\d]/,
  unmaskInputValueProp: true,
  validateUnMaskedValue: true,
  showFullMaskWhileTyping: true,
  exactLength: 16,
  customErrorMessages: {
    inputNotLongEnough: "Serial Number is not complete.",
  },
  // showFullMaskWhileTyping: true,
  // hideDotSlots: false
};

let $controlledValue1 = "";
const SerialInput3 = (
  <Input label="Serial3 Controlled No." value={$controlledValue1} />
);
const serialNoInputValidationOptions3: ValidatorOptions = {
  inputElm: SerialInput3[1],
  errorElm: SerialInput3[2],
  required: true,
  mask: "XXX ____ XDX-( ____ )-{ ____ }-[ ____ ]",
  maskSlots: "_",
  dataAccept: /[\d]/,
  unmaskInputValueProp: false,
  validateUnMaskedValue: true,
  showFullMaskWhileTyping: true,
  exactLength: 16,
  customErrorMessages: {
    inputNotLongEnough: "Serial Number is not complete.",
  },
  // showFullMaskWhileTyping: true,
  // hideDotSlots: false
};

let $controlledValue2 = "";
const SerialInput4 = (
  <Input label="Serial4 Controlled No." value={$controlledValue2} />
);
const serialNoInputValidationOptions4: ValidatorOptions = {
  inputElm: SerialInput4[1],
  errorElm: SerialInput4[2],
  required: true,
  mask: "XXX ____ XDX-( ____ )-{ ____ }-[ ____ ]",
  maskSlots: "_",
  dataAccept: /[\d]/,
  unmaskInputValueProp: true,
  validateUnMaskedValue: true,
  showFullMaskWhileTyping: true,
  exactLength: 16,
  customErrorMessages: {
    inputNotLongEnough: "Serial Number is not complete.",
  },
  // showFullMaskWhileTyping: true,
  // hideDotSlots: false
};

const IPv4Input = <Input label="IP v4" placeholder="123.234.123.234" />;
const ipv4InputValidationOptions: ValidatorOptions = {
  inputElm: IPv4Input[1],
  errorElm: IPv4Input[2],
  pattern: /^$|^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/,
  dataAccept: /[\d.]/,
  validateOnInput: false,
};

const NameInput = <Input label="Name" placeholder="John Doe" />;
const nameInputValidationOptions: ValidatorOptions = {
  inputElm: NameInput[1],
  errorElm: NameInput[2],
  required: true,
};

const TelephoneInput = <Input label="Telephone" placeholder="(___) ___ ____" />;
const phoneInputValidationOptions: ValidatorOptions = {
  inputElm: TelephoneInput[1],
  errorElm: TelephoneInput[2],
  required: true,
  mask: "(___) ___ ____",
  maskSlots: "_",
  dataAccept: /[\d]/,
  showFullMaskWhileTyping: true,
  exactLength: 10,
};

const StreetInput = <Input label="Street" placeholder="1234 Main St." />;
const streetInputValidationOptions: ValidatorOptions = {
  inputElm: StreetInput[1],
  errorElm: StreetInput[2],
  required: true,
  minLength: 4,
  maxLength: 10,
};

const ZipInput = <Input label="Zip" placeholder="12345" />;
const zipInputValidationOptions: ValidatorOptions = {
  inputElm: ZipInput[1],
  errorElm: ZipInput[2],
  required: true,
  mask: ".....",
  maskSlots: ".",
  dataAccept: /[\d]/,
  exactLength: 5,
};

const CommentsInput = <Input label="Comments" placeholder="" />;
const commentsInputValidationOptions: ValidatorOptions = {
  inputElm: CommentsInput[1],
  errorElm: CommentsInput[2],
  maxLength: 20,
};

const CreditCardInput = <Input label="Credit Card" />;
const creditCardInputValidationOptions: ValidatorOptions = {
  inputElm: CreditCardInput[1],
  errorElm: CreditCardInput[2],
  mask: ".... .... .... ....",
  maskSlots: ".",
  dataAccept: /[\d]/,
  exactLength: 16,
  required: true,
  customValidator: luhnCheck,
  customErrorMessages: {
    customNotValid: "Credit Card Number is not Valid.",
  },
};

const ExpirationInput = <Input label="Expiration" placeholder="MM/YY" />;
const expirationInputValidationOptions: ValidatorOptions = {
  inputElm: ExpirationInput[1],
  errorElm: ExpirationInput[2],
  pattern: /\d\d\/\d\d/,
  mask: "../..",
  maskSlots: ".",
  exactLength: 5,
  required: true,
  validateUnMaskedValue: false,
  customErrorMessages: {
    patternNotValid: "Expiration date is invalid or expired.",
  },
  customValidator: validateExpireDate,
};

const CVVInput = <Input label="CVV" placeholder="000" />;
const cvvInputValidationOptions: ValidatorOptions = {
  inputElm: CVVInput[1],
  errorElm: CVVInput[2],
  minLength: 3,
  maxLength: 4,
  required: true,
};

const emailInput = <Input label="Email" type="email" placeholder="Email" />;
const emailInputValidationOptions: ValidatorOptions = {
  inputElm: emailInput[1],
  required: true,
};

function setupInputValidators() {
  setupValidatorInput(serialNoInputValidationOptions);
  setupValidatorInput(serialNoInputValidationOptions2);
  setupValidatorInput(serialNoInputValidationOptions3);
  setupValidatorInput(serialNoInputValidationOptions4);
  setupValidatorInput(ipv4InputValidationOptions);
  setupValidatorInput(nameInputValidationOptions);
  setupValidatorInput(phoneInputValidationOptions);
  setupValidatorInput(streetInputValidationOptions);
  setupValidatorInput(zipInputValidationOptions);
  setupValidatorInput(commentsInputValidationOptions);
  setupValidatorInput(creditCardInputValidationOptions);
  setupValidatorInput(expirationInputValidationOptions);
  setupValidatorInput(cvvInputValidationOptions);
  setupValidatorInput(emailInputValidationOptions);
}

const handleSubmit = (ev) => {
  ev.preventDefault();
  if (Form.checkValidity()) {
    const data = getFormData(Form);
    console.log(data);
  }
};

const Form = (
  <form onMount={setupInputValidators} onSubmit={handleSubmit}>
    {SerialInput}
    {SerialInput2}
    {SerialInput3}
    <p id="controlled-value-1">{$controlledValue1}</p>
    {SerialInput4}
    <p id="controlled-value-2">{$controlledValue2}</p>
    {IPv4Input}
    {NameInput}
    {TelephoneInput}
    {StreetInput}
    {ZipInput}
    {CommentsInput}
    {CreditCardInput}
    {ExpirationInput}
    {CVVInput}
    {emailInput}

    <input type="submit" />
  </form>
);

export function Page() {
  return (
    <>
      <h1>Validator Demo</h1>
      {Form}
    </>
  );
}

function luhnCheck(ccNumWithSpaces) {
  const ccNum = ccNumWithSpaces.replaceAll(" ", "");
  const arr = [0, 2, 4, 6, 8, 1, 3, 5, 7, 9];
  let bit = 1;
  let len = ccNum.length;
  let sum = 0;
  let val;

  while (len) {
    val = parseInt(ccNum.charAt(--len), 10);
    sum += (bit ^= 1) ? arr[val] : val;
  }

  return sum && sum % 10 === 0;
}

function validateExpireDate(dateString) {
  const re = new RegExp("^(0[1-9]|1[0-2])/?([0-9]{2})$");
  if (!re.test(dateString)) return "Expiration date is invalid or expired.";
  // return "The expire date format must be MM/YY. ie: 03/24";

  const [month, year] = dateString.split("/");
  const ccMonth = parseInt(month);
  const ccYear = parseInt(year);

  const d = new Date();
  const thisMonth = d.getMonth() + 1;
  const thisYear = parseInt(d.getFullYear().toString().slice(2));
  const maxYear = thisYear + 10;
  const expYearIsInRange = ccYear >= thisYear && ccYear < maxYear;
  const expIsInFutureYear = ccYear > thisYear;
  const expMonthIsInRange = expIsInFutureYear || ccMonth >= thisMonth;
  if (expYearIsInRange && expMonthIsInRange) return true;
  return "Expiration date is invalid or expired.";
}

export const Layout = MyLayout;
