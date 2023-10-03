import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { render } from "rezact";
import { Page } from "./FormValidation"; // Adjust the import to the actual file path
import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { delay, dispatchBlur, simulateTyping } from "src/lib/utils";

const user = userEvent.setup();
let originalConsoleInfo = console.info;

beforeAll(() => {
  console.info = () => {};
});

afterAll(() => {
  console.info = originalConsoleInfo;
});

describe("Form Validation Tests", () => {
  it("renders Page component and all input fields", async () => {
    render(document.body, Page);
    expect(screen.getByText("Validator Demo")).not.toBeNull();
    await delay(100); //give the framework a bit to render everything

    expect(screen.getByLabelText("Serial No.")).not.toBeNull();
    expect(screen.getByLabelText("IP v4")).not.toBeNull();
    expect(screen.getByLabelText("Name")).not.toBeNull();
    expect(screen.getByLabelText("Telephone")).not.toBeNull();
    expect(screen.getByLabelText("Street")).not.toBeNull();
    expect(screen.getByLabelText("Zip")).not.toBeNull();
    expect(screen.getByLabelText("Comments")).not.toBeNull();
    expect(screen.getByLabelText("Credit Card")).not.toBeNull();
    expect(screen.getByLabelText("Expiration")).not.toBeNull();
    expect(screen.getByLabelText("CVV")).not.toBeNull();
  });

  it("renders placeholders correctly", async () => {
    expect(screen.getByPlaceholderText("123.234.123.234")).not.toBeNull();
    expect(screen.getByPlaceholderText("John Doe")).not.toBeNull();
    expect(screen.getByPlaceholderText("(___) ___ ____")).not.toBeNull();
    expect(screen.getByPlaceholderText("1234 Main St.")).not.toBeNull();
    expect(screen.getByPlaceholderText("12345")).not.toBeNull();
    expect(screen.getByPlaceholderText("MM/YY")).not.toBeNull();
    expect(screen.getByPlaceholderText("000")).not.toBeNull();
  });

  it("reports error on required elements when submit button is clicked", async () => {
    // Click the submit button
    const submitButton = screen.getByRole("button", { name: /submit/i });
    await user.click(submitButton);
    await delay(100);

    // Check if error elements/messages are rendered for required fields
    const checkError = (labelText: string) => {
      const inputElement = screen.getByLabelText(labelText);
      const expectedErrorMessage = `${labelText} is required.`;
      expect(inputElement.nextElementSibling.textContent).toBe(
        expectedErrorMessage
      );
    };

    checkError("Serial No.");
    checkError("Name");
    checkError("Telephone");
    checkError("Street");
    checkError("Zip");
    checkError("Credit Card");
    checkError("Expiration");
    checkError("CVV");
  });

  it("renders and validates Serial No input", async () => {
    const serialNoInput = screen.getByLabelText(
      "Serial No."
    ) as HTMLInputElement;

    expect(serialNoInput.nextElementSibling.textContent).toBe(
      "Serial No. is required."
    );

    // Test: Partial input should show "not complete" error
    serialNoInput.value = "123";
    serialNoInput.dispatchEvent(new Event("blur"));
    expect(serialNoInput.nextElementSibling.textContent).toBe(
      "Serial Number is not complete."
    );
    expect(serialNoInput.value).toBe("XXX 123_ XDX-( ____ )-{ ____ }-[ ____ ]");

    // // Test: Invalid characters should not be accepted
    serialNoInput.value = "XXX-ABCD-XDX-( EFGH )-{ IJKL }-[ MNOP ]";
    expect(serialNoInput.value).toBe("XXX ____ XDX-( ____ )-{ ____ }-[ ____ ]"); // Invalid characters are not accepted

    // // Test: Valid input should not show error
    serialNoInput.value = "1231231231231231";
    expect(serialNoInput.value).toBe("XXX 1231 XDX-( 2312 )-{ 3123 }-[ 1231 ]");
    expect(serialNoInput.nextElementSibling.textContent).toBe("");
  });

  it("renders and validates Serial No input with unmasked value prop", async () => {
    const serialNoInput = screen.getByLabelText(
      "Serial2 No."
    ) as HTMLInputElement;

    expect(serialNoInput.nextElementSibling.textContent).toBe(
      "Serial2 No. is required."
    );

    // Test: Partial input should show "not complete" error
    serialNoInput.value = "XXX 123_ XDX-( ____ )-{ ____ }-[ ____ ]";
    serialNoInput.dispatchEvent(new Event("blur"));
    expect(serialNoInput.nextElementSibling.textContent).toBe(
      "Serial Number is not complete."
    );
    expect(serialNoInput.value).toBe("123");

    // // Test: Invalid characters should not be accepted
    serialNoInput.value = "XXX-ABCD-XDX-( EFGH )-{ IJKL }-[ MNOP ]";
    expect(serialNoInput.value).toBe(""); // Invalid characters are not accepted

    // // Test: Valid input should not show error
    serialNoInput.value = "XXX 1231 XDX-( 2312 )-{ 3123 }-[ 1231 ]";
    expect(serialNoInput.value).toBe("1231231231231231");
    expect(serialNoInput.nextElementSibling.textContent).toBe("");
  });

  it("renders and validates Controlled Serial3 No input", async () => {
    const serialNoInput = screen.getByLabelText(
      "Serial3 Controlled No."
    ) as HTMLInputElement;
    const testP1 = document.getElementById("controlled-value-1");

    expect(serialNoInput.nextElementSibling.textContent).toBe(
      "Serial3 Controlled No. is required."
    );

    // Test: Partial input should show "not complete" error
    // dispatchFocus(serialNoInput);
    simulateTyping("1234567890", serialNoInput);
    dispatchBlur(serialNoInput);
    expect(serialNoInput.nextElementSibling.textContent).toBe(
      "Serial Number is not complete."
    );
    expect(serialNoInput.value).toBe("XXX 1234 XDX-( 5678 )-{ 90__ }-[ ____ ]");
    expect(testP1.textContent).toBe("XXX 1234 XDX-( 5678 )-{ 90__ }-[ ____ ]");

    simulateTyping("1234567890", serialNoInput);
    dispatchBlur(serialNoInput);
    expect(serialNoInput.nextElementSibling.textContent).toBe("");
    expect(serialNoInput.value).toBe("XXX 1234 XDX-( 5678 )-{ 9012 }-[ 3456 ]");
    expect(testP1.textContent).toBe("XXX 1234 XDX-( 5678 )-{ 9012 }-[ 3456 ]");
  });

  it("renders and validates Controlled Serial3 No input with unmasked value", async () => {
    const serialNoInput = screen.getByLabelText(
      "Serial4 Controlled No."
    ) as HTMLInputElement;
    const testP2 = document.getElementById("controlled-value-2");

    expect(serialNoInput.nextElementSibling.textContent).toBe(
      "Serial4 Controlled No. is required."
    );

    // Test: Partial input should show "not complete" error
    // dispatchFocus(serialNoInput);
    simulateTyping("1234567890", serialNoInput);
    dispatchBlur(serialNoInput);
    expect(serialNoInput.nextElementSibling.textContent).toBe(
      "Serial Number is not complete."
    );
    expect(serialNoInput.value).toBe("1234567890");
    expect(testP2.textContent).toBe("1234567890");

    simulateTyping("1234567890", serialNoInput);
    dispatchBlur(serialNoInput);
    expect(serialNoInput.nextElementSibling.textContent).toBe("");
    expect(serialNoInput.value).toBe("1234567890123456");
    expect(testP2.textContent).toBe("1234567890123456");
  });
});
