import { describe, expect, it } from "vitest";
import {
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

const user = userEvent.setup();

describe("Router Tests Suite", () => {
  it("First Render Home Page", async () => {
    document.body.innerHTML = `<div id="app"></div>`;
    const { router } = await import("./components/appRouter");
    router.routeRequest(window.location.pathname);
    const allHeaders = await screen.findAllByRole("heading", {
      name: /hello world/i,
    });
    expect(allHeaders).toHaveLength(1);
    expect(allHeaders[0].textContent).toBe("Hello World TEST");
  });

  it("Bleeds from previous test state", async () => {
    const allHeaders = await screen.findAllByRole("heading", {
      name: /hello world/i,
    });
    expect(allHeaders).toHaveLength(1);
    expect(allHeaders[0].textContent).toBe("Hello World TEST");
  });

  it("Loads the counter route", async () => {
    const links = await screen.findAllByRole("link", { name: /Counter/i });
    await user.click(links[0]);
    const counterBtns = await screen.findAllByRole("button", {
      name: "Clicked 0 times",
    });
    expect(counterBtns).toHaveLength(1);
    counterBtns[0].click();
    await waitFor(() =>
      expect(counterBtns[0].textContent).toBe("Clicked 1 time")
    );
  });
});

function delay(n) {
  return new Promise((res) => setTimeout(res, n));
}
