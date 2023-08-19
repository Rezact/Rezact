import { describe, expect, it } from "vitest";
import { screen, waitFor } from "@testing-library/dom";
import { render } from "src/lib/rezact/rezact";
import { Page } from "./Counter";

describe("counter suite name", () => {
  it("Counter", async () => {
    render(document.body, Page);
    const allHeaders = screen.getAllByText(/hello world/i);
    expect(allHeaders).toHaveLength(1);
    let button = await screen.findByRole("button");

    button.click();
    await waitFor(() => expect(button.textContent).toBe("Clicked 1 time"));

    button.click();
    await waitFor(() => expect(button.textContent).toBe("Clicked 2 times"));

    button.click();
    await waitFor(() => expect(button.textContent).toBe("Clicked 3 times"));
  });
});
