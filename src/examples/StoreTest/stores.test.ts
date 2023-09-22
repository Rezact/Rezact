import { describe, expect, it } from "vitest";
import { waitFor } from "@testing-library/dom";
import { render } from "rezact";
import Page from "./App";

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
});
