import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/dom";
import { render } from "rezact";
import { Page } from "./JsxSignals";
import { delay } from "src/lib/utils";

describe("JSX Signals suite", () => {
  it("renders JSX Signals Page", async () => {
    render(document.body, Page);
    await delay(100);
    const allHeaders = screen.getAllByText(/jsx signals/i);
    expect(allHeaders).toHaveLength(1);
  });

  it("switches elements (method 1)", async () => {
    const clickToggleButton = screen.getByRole("button", {
      name: /change 1/i,
    });
    expect(clickToggleButton).not.toBeNull();
    expect(screen.getByText("Test Signal Element")).not.toBeNull();
    await clickToggleButton.click();
    expect(screen.getByText("Changed Signal Element")).not.toBeNull();
  });

  it("switches elements (method 2)", async () => {
    const clickToggleButton = screen.getByRole("button", {
      name: /change 2/i,
    });
    expect(clickToggleButton).not.toBeNull();
    expect(screen.getByText("Elm 1")).not.toBeNull();
    await clickToggleButton.click();
    expect(screen.getByText("Elm 2")).not.toBeNull();
    await clickToggleButton.click();
    expect(screen.getByText("Elm 1")).not.toBeNull();
    await clickToggleButton.click();
    expect(screen.getByText("Elm 2")).not.toBeNull();
  });

  it("switches elements (method 3)", async () => {
    const clickToggleButton = screen.getByRole("button", {
      name: /change 3/i,
    });
    expect(clickToggleButton).not.toBeNull();
    expect(screen.getByText("Elm 3")).not.toBeNull();
    await clickToggleButton.click();
    expect(screen.getByText("Elm 4")).not.toBeNull();
    await clickToggleButton.click();
    expect(screen.getByText("Elm 3")).not.toBeNull();
    await clickToggleButton.click();
    expect(screen.getByText("Elm 4")).not.toBeNull();
  });

  it("switches fragments with fragments", async () => {
    const clickToggleButton = screen.getByRole("button", {
      name: /change 4/i,
    });
    expect(clickToggleButton).not.toBeNull();
    expect(screen.getByText("Elm 5")).not.toBeNull();
    expect(screen.getByText("Elm 6")).not.toBeNull();
    await clickToggleButton.click();
    expect(screen.getByText("Elm 7")).not.toBeNull();
    expect(screen.getByText("Elm 8")).not.toBeNull();
    await clickToggleButton.click();
    expect(screen.getByText("Elm 5")).not.toBeNull();
    expect(screen.getByText("Elm 6")).not.toBeNull();
    await clickToggleButton.click();
    expect(screen.getByText("Elm 7")).not.toBeNull();
    expect(screen.getByText("Elm 8")).not.toBeNull();
  });

  it("switches fragments with elements", async () => {
    const clickToggleButton = screen.getByRole("button", {
      name: /change 5/i,
    });
    expect(clickToggleButton).not.toBeNull();
    expect(screen.getByText("Elm 9")).not.toBeNull();
    await clickToggleButton.click();
    expect(screen.getByText("Elm 10")).not.toBeNull();
    expect(screen.getByText("Elm 11")).not.toBeNull();
    await clickToggleButton.click();
    expect(screen.getByText("Elm 9")).not.toBeNull();
    await clickToggleButton.click();
    expect(screen.getByText("Elm 10")).not.toBeNull();
    expect(screen.getByText("Elm 11")).not.toBeNull();
    await clickToggleButton.click();
    expect(screen.getByText("Elm 9")).not.toBeNull();
  });

  it("switches elements with fragments", async () => {
    const clickToggleButton = screen.getByRole("button", {
      name: /change 6/i,
    });
    expect(clickToggleButton).not.toBeNull();
    expect(screen.getByText("Elm 12")).not.toBeNull();
    expect(screen.getByText("Elm 13")).not.toBeNull();
    await clickToggleButton.click();
    expect(screen.getByText("Elm 14")).not.toBeNull();
    await clickToggleButton.click();
    expect(screen.getByText("Elm 12")).not.toBeNull();
    expect(screen.getByText("Elm 13")).not.toBeNull();
    await clickToggleButton.click();
    expect(screen.getByText("Elm 14")).not.toBeNull();
    await clickToggleButton.click();
    expect(screen.getByText("Elm 12")).not.toBeNull();
    expect(screen.getByText("Elm 13")).not.toBeNull();
  });
});
