import { describe, expect, it } from "vitest";
import { waitFor } from "@testing-library/dom";
import { render } from "rezact";
import Page from "./App";
import { wait } from "node_modules/@testing-library/user-event/dist/types/utils";

describe("Reactive Computations", () => {
  it("Doubled", async () => {
    render(document.body, Page);
    const p = document.querySelector("p");
    const buttons = document.querySelectorAll("button");
    const button1 = buttons[0];
    const button2 = buttons[1];

    expect(p.textContent).toBe("0");

    await button1.click();

    await waitFor(() => expect(p.textContent).toBe("1"));

    await button2.click();

    await waitFor(() => expect(p.textContent).toBe("2"));
  });

  it("Works with all Update and Assignment Operators", async () => {
    const buttons = document.querySelectorAll("button");
    const buttonInc1 = buttons[2];
    const buttonInc2 = buttons[3];
    const buttonDec1 = buttons[4];
    const buttonDec2 = buttons[5];
    const buttonMul1 = buttons[6];
    const buttonDiv1 = buttons[7];
    const buttonInc3 = buttons[8];
    const buttonDec3 = buttons[9];
    const buttonMul2 = buttons[10];
    const buttonDiv2 = buttons[11];

    const p = document.querySelector("strong");

    expect(p.textContent).toBe("0");

    await buttonInc1.click();
    await buttonInc1.click();
    await buttonInc1.click();
    await waitFor(() => expect(p.textContent).toBe("3"));

    await buttonInc2.click();
    await waitFor(() => expect(p.textContent).toBe("4"));

    await buttonDec1.click();
    await waitFor(() => expect(p.textContent).toBe("3"));

    await buttonDec2.click();
    await waitFor(() => expect(p.textContent).toBe("2"));

    await buttonMul1.click();
    await waitFor(() => expect(p.textContent).toBe("4"));

    await buttonDiv1.click();
    await waitFor(() => expect(p.textContent).toBe("2"));

    await buttonInc3.click();
    await waitFor(() => expect(p.textContent).toBe("4"));

    await buttonDec3.click();
    await waitFor(() => expect(p.textContent).toBe("2"));

    await buttonMul2.click();
    await waitFor(() => expect(p.textContent).toBe("6"));

    await buttonDiv2.click();
    await waitFor(() => expect(p.textContent).toBe("2"));
  });
});
