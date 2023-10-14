import { describe, expect, it } from "vitest";
import {
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

const user = userEvent.setup();
let router = null;

describe("Router Tests Suite", () => {
  it("First Render Home Page", async () => {
    document.body.innerHTML = `<div id="app"></div>`;
    const { router: _router } = await import("./components/appRouter");
    _router.routeRequest(window.location.pathname);
    router = _router;

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

  it("Loads the Home Page", async () => {
    const links = await screen.findAllByRole("link", { name: "Home" });
    await user.click(links[0]);
    const allHeaders = await screen.findAllByRole("heading", {
      name: /hello world/i,
    });
    expect(allHeaders).toHaveLength(1);
    expect(allHeaders[0].textContent).toBe("Hello World TEST");
  });

  it("Home Page Input Works", async () => {
    const inp = screen.getByLabelText("Test Input");
    inp.focus();
    await user.keyboard("Hello");
    expect(inp.value).toBe("testHello");
    const allHeaders = await screen.findAllByRole("heading", {
      name: /hello world/i,
    });
    expect(allHeaders).toHaveLength(1);
    await waitFor(() =>
      expect(allHeaders[0].textContent).toBe("Hello World TESTHELLO")
    );
  });

  it("Home Page Toggle Works", async () => {
    let toggleButtons = screen.getAllByRole("button", { name: /toggle/i });
    expect(toggleButtons).toHaveLength(3);
    await waitFor(() =>
      expect(toggleButtons[0].previousElementSibling.textContent).toBe(
        "0. apple On"
      )
    );

    toggleButtons[0].click();
    await waitFor(() =>
      expect(toggleButtons[0].previousElementSibling.textContent).toBe(
        "0. apple Off"
      )
    );
  });

  it("Route Params Link Works", async () => {
    const links = await screen.findAllByRole("link", { name: "Route Params" });
    await user.click(links[0]);
    const allHeaders = await screen.findAllByRole("heading", {
      name: /Path Params Test/i,
    });
    expect(allHeaders).toHaveLength(1);
    await waitFor(() =>
      expect(allHeaders[0].textContent).toBe("Path Params Test")
    );

    const paragraphs = document.querySelectorAll("p");
    expect(paragraphs).toHaveLength(2);
    expect(paragraphs[0].textContent).toBe("ID: asdf");
    expect(paragraphs[1].textContent).toBe("Test Param: qwer");
  });

  it("Home Page Input State Persists across navigations", async () => {
    const links = await screen.findAllByRole("link", { name: "Home" });
    await user.click(links[0]);
    const allHeaders = await screen.findAllByRole("heading", {
      name: /hello world/i,
    });
    expect(allHeaders).toHaveLength(1);
    await waitFor(() =>
      expect(allHeaders[0].textContent).toBe("Hello World TESTHELLO")
    );
    const inp = screen.getByLabelText("Test Input");
    expect(inp.value).toBe("testHello");
  });

  it("MDX route loads", async () => {
    const links = await screen.findAllByRole("link", { name: "MDX" });
    await user.click(links[0]);
    await waitFor(() =>
      expect(screen.getByText("Testing Nested 2")).toBeDefined()
    );

    const paragraphs = document.querySelectorAll("p");
    expect(paragraphs).toHaveLength(4);
    expect(paragraphs[0].textContent).toBe("Testing Nested");
    expect(paragraphs[1].textContent).toBe("Testing Nested 2");

    const codeElm = document.querySelector("code.hljs.language-javascript");
    expect(codeElm).not.toBeNull();
    expect(codeElm.children[0].classList.toString()).toBe("hljs-comment");
  });

  it("Router Back Home (Toggle Button State is lost)", async () => {
    router.routeRequest(window.location.pathname);

    const allHeaders = await screen.findAllByRole("heading", {
      name: /hello world testhello/i,
    });
    expect(allHeaders).toHaveLength(1);
    await waitFor(() =>
      expect(allHeaders[0].textContent).toBe("Hello World TESTHELLO")
    );
    const inp = screen.getByLabelText("Test Input");
    expect(inp.value).toBe("testHello");

    let toggleButtons = screen.getAllByRole("button", { name: /toggle/i });
    expect(toggleButtons).toHaveLength(3);
    await waitFor(() =>
      expect(toggleButtons[0].previousElementSibling.textContent).toBe(
        "0. apple On"
      )
    );
  });

  it("Navigates to the multiple counter link", async () => {
    const links = await screen.findAllByRole("link", {
      name: "Counter Multiple",
    });
    await user.click(links[0]);
    await waitFor(async () => {
      const counterBtns = await screen.findAllByRole("button", {
        name: "Clicked 0 times",
      });
      expect(counterBtns).toHaveLength(10);
    });
    const counterBtns = await screen.findAllByRole("button", {
      name: "Clicked 0 times",
    });
    counterBtns[1].click();
    await waitFor(() =>
      expect(counterBtns[1].textContent).toBe("Clicked 1 time")
    );
  });

  it("Navigates to persistent toggle state home page", async () => {
    const links = await screen.findAllByRole("link", {
      name: "Home (Persistent Toggle States)",
    });
    await user.click(links[0]);

    const allHeaders = await screen.findAllByRole("heading", {
      name: /hello world test/i,
    });
    expect(allHeaders).toHaveLength(1);
    expect(allHeaders[0].textContent).toBe("Hello World TEST");

    let toggleButtons = screen.getAllByRole("button", { name: /toggle/i });
    expect(toggleButtons).toHaveLength(3);
    await waitFor(() =>
      expect(toggleButtons[0].previousElementSibling.textContent).toBe(
        "0. apple On"
      )
    );

    toggleButtons[0].click();
    await waitFor(() =>
      expect(toggleButtons[0].previousElementSibling.textContent).toBe(
        "0. apple Off"
      )
    );
  });

  it("Navigates to nested children page", async () => {
    const links = await screen.findAllByRole("link", {
      name: "Nested Children",
    });
    await user.click(links[0]);

    await waitFor(() => screen.getByText("Child One"));
    const child1 = await screen.findAllByText("Child One");
    const child2 = await screen.findAllByText("Child Two");
    const child3 = await screen.findAllByText("Child Three");

    expect(child1).toHaveLength(1);
    expect(child2).toHaveLength(1);
    expect(child3).toHaveLength(1);
  });

  it("Maintains Toggle States on persistent toggle state home page", async () => {
    const links = await screen.findAllByRole("link", {
      name: "Home (Persistent Toggle States)",
    });
    await user.click(links[0]);

    const allHeaders = await screen.findAllByRole("heading", {
      name: /hello world test/i,
    });
    expect(allHeaders).toHaveLength(1);
    expect(allHeaders[0].textContent).toBe("Hello World TEST");

    let toggleButtons = screen.getAllByRole("button", { name: /toggle/i });

    await waitFor(() =>
      expect(toggleButtons[0].previousElementSibling.textContent).toBe(
        "0. apple Off"
      )
    );
  });

  it("Dynamic Route Params Works", async () => {
    router.routeRequest("/post/5678/something/1234");
    const allHeaders = await screen.findAllByRole("heading", {
      name: /Path Params Test/i,
    });
    expect(allHeaders).toHaveLength(1);
    await waitFor(() =>
      expect(allHeaders[0].textContent).toBe("Path Params Test")
    );

    const paragraphs = document.querySelectorAll("p");
    expect(paragraphs).toHaveLength(2);
    expect(paragraphs[0].textContent).toBe("ID: 5678");
    expect(paragraphs[1].textContent).toBe("Test Param: 1234");
  });

  it("JSX Signals", async () => {
    router.routeRequest("/jsx-signals");
    const allHeaders = await screen.findAllByRole("heading", {
      name: /JSX Signals/i,
    });
    expect(allHeaders).toHaveLength(1);
    await waitFor(() => expect(allHeaders[0].textContent).toBe("JSX Signals"));

    const jsxSignals = document.getElementById("jsx-signals-test-id");
    expect(jsxSignals).not.toMatchSnapshot();
  });
});

function delay(n) {
  return new Promise((res) => setTimeout(res, n));
}
