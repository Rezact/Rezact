import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/dom";
import { render } from "rezact";
import { Page } from "./ValueAttributeDot";
import { delay } from "src/lib/utils";
import userEvent from "@testing-library/user-event";

const user = userEvent.setup();

describe("Input Value Attribute suite", () => {
  it("Works with Dot notation", async () => {
    render(document.body, Page);
    await delay(100);
    const allHeaders = screen.getAllByText(/input value attribute/i);
    expect(allHeaders).toHaveLength(1);

    const pValue = document.getElementById("count-value");
    const inputs = document.querySelectorAll("input");
    const numInput1 = inputs[0] as HTMLInputElement;
    const numInput2 = inputs[1] as HTMLInputElement;

    expect(numInput1.value).toBe("10");
    expect(numInput2.value).toBe("10");
    expect(pValue?.textContent).toBe("10");

    await user.type(numInput1, "5");

    expect(numInput1.value).toBe("105");
    expect(numInput2.value).toBe("105");
    expect(pValue?.textContent).toBe("105");

    await user.type(numInput2, "5");

    expect(numInput1.value).toBe("1055");
    expect(numInput2.value).toBe("1055");
    expect(pValue?.textContent).toBe("1055");
  });
});
