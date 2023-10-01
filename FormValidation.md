# Guide to Using the Form Validation Library

## Table of Contents

1. [Import](#import)
2. [Basic Setup](#basic-setup)
   - [Example](#example)
3. [Options](#options)
4. [Custom Error Messages](#custom-error-messages)
   - [Usage](#usage)
   - [Available Custom Error Message Keys](#available-custom-error-message-keys)
   - [Example](#example-1)
5. [Masking Input](#masking-input)
   - [Practical Usage](#practical-usage)
6. [Custom Validation](#custom-validation)
   - [Example](#example-2)
7. [Displaying Validation Errors with `errorElm`](#displaying-validation-errors-with-errorElm)
   - [Error Element (`errorElm`)](#1-error-element-errorElm)
   - [Manipulating `errorElm` Display](#2-manipulating-errorElm-display)
   - [Custom Error Messages](#3-custom-error-messages)
   - [Styling and Visual Feedback](#4-styling-and-visual-feedback)
   - [Validation Triggering and Message Clearance](#5-validation-triggering-and-message-clearance)
   - [Example](#example-3)
8. [Full Single File Example](#full-single-file-example)

---

### **Import**

Include the library in your project. If it’s a module, you can import it as follows:

```javascript
import { setupValidatorInput } from "@rezact/rezact/validator";
import type { ValidatorOptions } from "@rezact/rezact/validator";
```

---

### **Basic Setup**

To set up an input for validation, you need to call the `setupValidatorInput` function with the appropriate options.

#### Example:

```javascript
import { getFormData } from "@rezact/rezact/formHelper";
import { setupValidatorInput } from "@rezact/rezact/validator";

const MyInputGroup = (
  <>
    <label>My Input</label>
    <input name="my-input" />
    <div class="error-elm"></div>
  </>
);

// call this function in the onMount of the form
function setupInputValidators() {
  setupValidatorInput({
    inputElm: MyInputGroup[1],
    errorElm: MyInputGroup[2],
    required: true,
    minLength: 5,
  });
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
    {MyInputGroup}
    <button>Submit</button>
  </form>
);

export default function App() {
  return <>{Form}</>;
}
```

---

### **Options**

Here are the options you can pass to `setupValidatorInput`:

- `inputElm` (Required): The input element you want to validate. It must be an HTMLInputElement.
- `errorElm` (Optional): The element where error messages will be displayed. It must be an HTMLElement
- `required` (Optional): Whether the input is required. Default is `false`.
- `minLength` (Optional): The minimum length of the input value.
- `maxLength` (Optional): The maximum length of the input value.
- `exactLength` (Optional): The exact length the input value should be.
- `pattern` (Optional): A RegExp pattern the input value should match.
- `customValidator` (Optional): A custom validation function. It should return `true` if valid, `false` or an error message `string` if invalid.
- `mask` (Optional): A string representing the input mask.
- `maskSlots` (Optional): A string representing the mask slots.
- `dataAccept` (Optional): A string representing the RegExp pattern of accepted characters.
- `allowUnacceptedChars` (Optional): Whether to allow characters not matching `dataAccept`. Default is `false`.
- `unmaskInputValueProp` (Optional): Whether to unmask the input value property. Default is `false`.
- `showFullMaskWhileTyping` (Optional): Whether to show the full mask while typing. Default is `false`.
- `hideDotSlots` (Optional): Whether to hide dot slots in the mask. Default is `true`.
- `validateUnMaskedValue` (Optional): Whether to validate the unmasked value. Default is `true`.
- `validateOnInput` (Optional): Whether to validate on input (every key press). Default is `true`.
- `isNumeric` (Optional): Whether the input is numeric. Default is determined by `dataAccept`.
- `customErrorMessages` (Optional): An object containing custom error messages for different validation errors.

---

### Custom Error Messages

Custom error messages can be defined in the `ValidatorOptions` for each input component. They allow you to override the default error messages with messages that are more specific and meaningful to your application's context.

#### Usage:

To use custom error messages, you can define them in the `customErrorMessages` property of the `ValidatorOptions` object. The keys of this object correspond to the type of validation error, and the values are the custom messages you want to display.

#### Available Custom Error Message Keys:

- `isRequired`: Use this key when the input is required but not provided.
- `inputNotLongEnough`: Use this key when the input does not meet the required minimum length.
- `inputLengthTooLong`: Use this key when the input exceeds the allowed maximum length.
- `patternNotValid`: Use this key when the input does not match the specified pattern.
- `customNotValid`: Use this key for any custom validation error messages when using `customValidator` option.

#### Example:

```javascript
const expirationInputValidationOptions: ValidatorOptions = {
  // ... other options
  customErrorMessages: {
    patternNotValid: "Expiration date is invalid or expired.",
    isRequired: "Expiration date is required.",
  },
};
```

In this example, if the input does not match the specified pattern for the expiration date, the custom error message "Expiration date is invalid or expired." will be displayed. If the input is required but not provided, "Expiration date is required." will be displayed.

---

### **Masking Input**

The mask options in the Validator Library allow you to define a user-friendly format for input fields, guiding users as they enter data and ensuring consistency in the data format. Below are the mask-related options and their effects:

#### 1. `mask`:

- **Description**: A string representing the format you want the user to see and follow. It can include characters representing data slots, and any other characters representing static parts of the mask.
- **Example**: For a serial number input, you might use a mask like "XXX \_**\_ XDX-( \_\_** )-{ \_**\_ }-[ \_\_** ]".

#### 2. `maskSlots`:

- **Description**: A string representing the character used as a placeholder in the mask for the user to enter data.
- **Example**: If you use "\_" as the `maskSlots`, in a mask like "XXX \_\_\_\_ XDX", the underscores represent the slots where users can enter data.

#### 3. `showFullMaskWhileTyping`:

- **Description**: A boolean that, when true, displays the full mask as soon as the user starts typing, helping them understand the expected format.
- **Example**: If you have a mask like "(**_) _**-\_\_\_\_" for a phone number, enabling this option will show the entire mask, including parentheses and the dash, as soon as the user starts typing.

#### 4. `unmaskInputValueProp`:

- **Description**: A boolean that, when true, removes the mask from the value property of the input element. While the user sees the masked value as they input data, programmatic access to the input's value will retrieve the unmasked value.
- **Example**: If an input has a mask of "XXX \_**\_ XDX-( \_\_** )-{ \_**\_ }-[ \_\_** ]" and displays as "XXX 1231 XDX-( 2312 )-{ 3123 }-[ 1231 ]" after user input, accessing `inputElm.value` with this option enabled will return "1231231231231231".

#### 5. `dataAccept`:

- **Description**: A regular expression defining the characters allowed in the data slots of the mask.
- **Example**: If you want to allow only digits in the data slots, you would use `/[\d]/`.

#### 6. `validateUnMaskedValue`:

- **Description**: A boolean that, when true, will perform any validations on the unmasked value of the input.
- **Example**: If you have an input with a mask and want to validate the length of the unmasked value, enabling this option will use the length of the unmasked value for the validation.

### Practical Usage:

When setting up an input with mask options, you define the mask, maskSlots, and other related options in the `ValidatorOptions` object and then pass it to the `setupValidatorInput` function along with other validation options. This way, users see a formatted input field, guiding them to enter data in the correct format, while you can still access and validate the raw, unformatted data programmatically when needed.

---

### **Custom Validation**

You can also provide a custom validation function using the `customValidator` option. This function should return `true` if the input is valid, and `false` or a custom error message string if the input is invalid.

#### Example:

```javascript
setupValidatorInput({
  inputElm: document.querySelector("#myInput"),
  customValidator: (value) => {
    if (value !== "expectedValue") return "The value is not valid.";
    return true;
  },
});
```

---

### Displaying Validation Errors with `errorElm`

#### 1. **Error Element (`errorElm`):**

- Each input field has a corresponding `errorElm`, typically a `div`, where validation error messages are displayed.
- This `errorElm` is usually placed below the input field and is responsible for showing the user what went wrong with their input.

#### 2. **Manipulating `errorElm` Display:**

- The library dynamically manipulates the `height` attribute of the `errorElm` to show and hide error messages.
- When a validation error occurs, the `height` of the `errorElm` is adjusted to reveal the error message.
- When the input is corrected, the `height` is reset to `0px`, hiding the error message and giving a smooth transition effect between states.
- This manipulation is done with a transition effect, typically set with CSS, to ensure a smooth and visually pleasing appearance and disappearance of the error message.

#### 3. **Custom Error Messages:**

- Custom error messages can be defined for various validation scenarios using the `customErrorMessages` property in the `ValidatorOptions`.
- These messages are displayed in the `errorElm` when the corresponding validation fails, providing clear and concise feedback to the user.

#### 4. **Styling and Visual Feedback:**

- The `errorElm` and its messages are typically styled with attention-grabbing colors, like red, to ensure users notice them.
- The transition effect on the `height` attribute provides smooth visual feedback, enhancing user experience by not startling them with sudden changes.

#### 5. **Validation Triggering and Message Clearance:**

- Error messages are dynamically displayed or cleared based on user interaction and input validity.
- The library can be configured to validate inputs at different interaction points, displaying error messages immediately or after specific user actions.
- Once the user corrects their input to meet the validation criteria, the error messages are cleared, and the `errorElm` is hidden by resetting its `height` to `0px`.

### Example:

In the provided example, each `Input` component has an associated `errorElm` placed below the input field. When a validation error occurs, the `height` of the `errorElm` is adjusted to reveal the custom error message, and it’s reset to `0px` when the error is corrected.

```jsx
const serialNoInputValidationOptions: ValidatorOptions = {
  // ...
  errorElm: SerialInput[2],
  customErrorMessages: {
    inputNotLongEnough: "Serial Number is not complete.",
  },
  // ...
};
```

---

# Full Single File Example

For a more comprehensive single file example checkout https://github.com/Rezact/Rezact/blob/main/src/examples/FormValidation/FormValidation.tsx
