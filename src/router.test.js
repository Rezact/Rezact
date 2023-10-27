import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

const currentFetch = global.fetch;
const currentHistory = global.history;
const historyState = [];

beforeAll(() => {
  global.fetch = async () => {
    return {
      async json() {
        return [
          { testData: "test1-loaded" },
          { testData: "test2-loaded" },
          { testData: "test3-loaded" },
        ];
      },
    };
  };
  global.history = {
    pushState: (...args) => {
      location.pathname = args[2];
      historyState.push(args);
    },
  };
});

afterAll(() => {
  global.fetch = currentFetch;
  global.history = currentHistory;
});
const user = userEvent.setup();
let router = null;

describe("Router Tests Suite", () => {
  it("First Render Home Page", async () => {
    document.body.innerHTML = `<div id="app"></div>`;
    const { router: _router } = await import("./components/appRouter");
    _router.routeRequest("/");
    router = _router;

    const allHeaders = await screen.findAllByRole("heading", {
      name: /hello world/i,
    });
    expect(allHeaders).toHaveLength(1);
    expect(allHeaders[0].textContent).toBe("Hello World TEST");
    const routerOutlet = document.getElementById("router-outlet-test");
    expect(routerOutlet.innerHTML).toMatchSnapshot();
    expect(document.title).toBe("Testing Root Title");
  });

  it("Bleeds from previous test state", async () => {
    const allHeaders = await screen.findAllByRole("heading", {
      name: /hello world/i,
    });
    expect(allHeaders).toHaveLength(1);
    expect(allHeaders[0].textContent).toBe("Hello World TEST");
  });

  it("PopState Event Works", async () => {
    const state = { someData: "data" }; // The state object you want to pass
    const popstateEvent = new PopStateEvent("popstate", { state });

    window.dispatchEvent(popstateEvent);
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

    expect(links[0].parentElement.classList.toString()).toBe("active");
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
    expect(paragraphs).toHaveLength(3);
    expect(paragraphs[0].textContent).toBe("ID: asdf");
    expect(paragraphs[1].textContent).toBe("Test Param: qwer");

    expect(location.pathname).toBe("/post/asdf/something/qwer");
    const routerOutlet = document.getElementById("router-outlet-test");
    let testButtons = routerOutlet.querySelectorAll("button");
    expect(testButtons).toHaveLength(4);

    testButtons[0].click();
    expect(paragraphs[0].textContent).toBe("ID: test1id");
    expect(paragraphs[1].textContent).toBe("Test Param: qwer");
    expect(location.pathname).toBe("/post/test1id/something/qwer");

    testButtons[1].click();
    expect(paragraphs[0].textContent).toBe("ID: test1id");
    expect(paragraphs[1].textContent).toBe("Test Param: test2test");
    expect(location.pathname).toBe("/post/test1id/something/test2test");

    testButtons[2].click();
    expect(paragraphs[0].textContent).toBe("ID: test3id");
    expect(paragraphs[1].textContent).toBe("Test Param: test2test");
    expect(location.pathname).toBe("/post/test3id/something/test2test");

    expect(links[0].parentElement.classList.toString()).toBe("active");

    testButtons[3].click();
    expect(paragraphs[0].textContent).toBe("ID: test3id");
    expect(paragraphs[1].textContent).toBe("Test Param: test4test");
    expect(location.pathname).toBe("/post/test3id/something/test4test");

    await user.click(links[0]);
    const paragraphs2 = document.querySelectorAll("p");
    expect(paragraphs2[0].textContent).toBe("ID: asdf");
    expect(paragraphs2[1].textContent).toBe("Test Param: qwer");
    expect(location.pathname).toBe("/post/asdf/something/qwer");
  });

  it("CONFIG BASED - Ambiguous Route/Params Link Works 1", async () => {
    const links = await screen.findAllByRole("link", {
      name: "CONFIG BASED - Ambiguous Route/Params 1",
    });
    await user.click(links[0]);
    const allHeaders = await screen.findAllByRole("heading", {
      name: /Ambiguous Test 1/i,
    });
    expect(allHeaders).toHaveLength(1);
    await waitFor(() =>
      expect(allHeaders[0].textContent).toBe("Ambiguous Test 1")
    );

    const paragraphs = document.querySelectorAll("p");
    expect(paragraphs).toHaveLength(2);
    expect(paragraphs[0].textContent).toBe("ID: config123");
    expect(document.title).toBe("Payments Test 2");

    expect(location.pathname).toBe("/payments2/config123");
    let testButton = screen.getAllByRole("button", { name: /test/i });
    expect(testButton).toHaveLength(1);
    testButton[0].click();
    await waitFor(() => expect(paragraphs[0].textContent).toBe("ID: test"));
    expect(location.pathname).toBe("/payments2/test");
  });

  it("CONFIG BASED - Ambiguous Route/Params Link Works 2", async () => {
    const links = await screen.findAllByRole("link", {
      name: "CONFIG BASED - Ambiguous Route/Params 2",
    });
    await user.click(links[0]);
    const allHeaders = await screen.findAllByRole("heading", {
      name: /Ambiguous Test 2/i,
    });
    expect(allHeaders).toHaveLength(1);
    await waitFor(() =>
      expect(allHeaders[0].textContent).toBe("Ambiguous Test 2")
    );

    const paragraphs = document.querySelectorAll("p");
    expect(paragraphs).toHaveLength(2);
    expect(paragraphs[0].textContent).toBe("ID: config321");
    expect(document.title).toBe("ACH Test 2");
  });

  it("CONFIG BASED - Nested Route Level 1", async () => {
    const links = await screen.findAllByRole("link", {
      name: "CONFIG BASED - Nested Routes /users",
    });
    await user.click(links[0]);
    await delay(200);
    const testDiv = document.getElementById("nested-routes-test-id");
    expect(testDiv.innerHTML).toMatchSnapshot();

    router.routeRequest("/users");
    await delay(200);
    const testDiv2 = document.getElementById("nested-routes-test-id");
    expect(testDiv2.innerHTML).toMatchSnapshot();
    expect(document.title).toBe("Users Test 2");
  });

  it("CONFIG BASED - Nested Route Level 3", async () => {
    const links = await screen.findAllByRole("link", {
      name: "CONFIG BASED - Nested Routes /users/:id/settings",
    });
    await user.click(links[0]);
    await delay(200);
    const testDiv = document.getElementById("nested-routes-test-id");
    expect(testDiv.innerHTML).toMatchSnapshot();

    router.routeRequest("/users/953test/settings");
    await delay(200);
    const testDiv2 = document.getElementById("nested-routes-test-id");
    expect(testDiv2.innerHTML).toMatchSnapshot();
    expect(document.title).toBe("Users Settings Test 2");
  });

  it("CONFIG BASED - Nested Route Level 2", async () => {
    const links = await screen.findAllByRole("link", {
      name: "CONFIG BASED - Nested Routes /users/:id",
    });
    await user.click(links[0]);
    await delay(200);
    const testDiv = document.getElementById("nested-routes-test-id");
    expect(testDiv.innerHTML).toMatchSnapshot();

    router.routeRequest("/users/953test");
    await delay(200);
    const testDiv2 = document.getElementById("nested-routes-test-id");
    expect(testDiv2.innerHTML).toMatchSnapshot();
    expect(document.title).toBe("Users ID Test 2");
  });

  it("CONFIG BASED - Nested Route Level 4", async () => {
    const links = await screen.findAllByRole("link", {
      name: "Nested Routes /users/:id/settings/all/wild/card/stuff",
    });
    await user.click(links[0]);
    await delay(200);
    const testDiv = document.getElementById("nested-routes-test-id");
    expect(testDiv.innerHTML).toMatchSnapshot();

    router.routeRequest("/users/953test/settings/all/wild/card/stuff");
    await delay(200);
    const testDiv2 = document.getElementById("nested-routes-test-id");
    expect(testDiv2.innerHTML).toMatchSnapshot();
    expect(document.title).toBe("Users Catch AllTest 2");
  });

  it("CONFIG BASED - Nested Route Level 1 Again", async () => {
    const links = await screen.findAllByRole("link", {
      name: "CONFIG BASED - Nested Routes /users",
    });
    await user.click(links[0]);
    await delay(100);
    const testDiv = document.getElementById("nested-routes-test-id");
    expect(testDiv.innerHTML).toMatchSnapshot();

    router.routeRequest("/users");
    await delay(100);
    const testDiv2 = document.getElementById("nested-routes-test-id");
    expect(testDiv2.innerHTML).toMatchSnapshot();
    expect(document.title).toBe("Users Test 2");
  });

  it("DIRECT COMPONENT - Nested Route Level 1", async () => {
    const links = await screen.findAllByRole("link", {
      name: "DIRECT COMPONENT - Nested Routes /users",
    });
    await user.click(links[0]);
    await delay(200);
    const testDiv = document.getElementById("nested-routes-test-id");
    expect(testDiv.innerHTML).toMatchSnapshot();

    router.routeRequest("/users");
    await delay(200);
    const testDiv2 = document.getElementById("nested-routes-test-id");
    expect(testDiv2.innerHTML).toMatchSnapshot();
    expect(document.title).toBe("Users Test 3");
  });

  it("DIRECT COMPONENT - Nested Route Level 3", async () => {
    const links = await screen.findAllByRole("link", {
      name: "DIRECT COMPONENT - Nested Routes /users/:id/settings",
    });
    await user.click(links[0]);
    await delay(200);
    const testDiv = document.getElementById("nested-routes-test-id");
    expect(testDiv.innerHTML).toMatchSnapshot();

    router.routeRequest("/users/direct953test/settings");
    await delay(200);
    const testDiv2 = document.getElementById("nested-routes-test-id");
    expect(testDiv2.innerHTML).toMatchSnapshot();
    expect(document.title).toBe("Users Settings Test 3");
  });

  it("DIRECT COMPONENT - Nested Route Level 2", async () => {
    const links = await screen.findAllByRole("link", {
      name: "DIRECT COMPONENT - Nested Routes /users/:id",
    });
    await user.click(links[0]);
    await delay(200);
    const testDiv = document.getElementById("nested-routes-test-id");
    expect(testDiv.innerHTML).toMatchSnapshot();

    router.routeRequest("/users/direct333test");
    await delay(200);
    const testDiv2 = document.getElementById("nested-routes-test-id");
    expect(testDiv2.innerHTML).toMatchSnapshot();
    expect(document.title).toBe("Users ID Test 3");
  });

  it("DIRECT COMPONENT - Nested Route Level 4", async () => {
    const links = await screen.findAllByRole("link", {
      name: "DIRECT COMPONENT - Nested Routes /users/:id/settings/all/wild/card/stuff",
    });
    await user.click(links[0]);
    await delay(200);
    const testDiv = document.getElementById("nested-routes-test-id");
    expect(testDiv.innerHTML).toMatchSnapshot();

    router.routeRequest("/users/directXXXtest/settings/all/wild/card/stuff");
    await delay(200);
    const testDiv2 = document.getElementById("nested-routes-test-id");
    expect(testDiv2.innerHTML).toMatchSnapshot();
    expect(document.title).toBe("Users Catch AllTest 3");
  });

  it("DIRECT COMPONENT - Nested Route Level 1 Again", async () => {
    const links = await screen.findAllByRole("link", {
      name: "DIRECT COMPONENT - Nested Routes /users",
    });
    await user.click(links[0]);
    await delay(100);
    const testDiv = document.getElementById("nested-routes-test-id");
    expect(testDiv.innerHTML).toMatchSnapshot();

    router.routeRequest("/users");
    await delay(100);
    const testDiv2 = document.getElementById("nested-routes-test-id");
    expect(testDiv2.innerHTML).toMatchSnapshot();
    expect(document.title).toBe("Users Test 3");
  });

  it("Ambiguous Route/Params Link Works 1", async () => {
    const links = await screen.findAllByRole("link", {
      name: "Ambiguous Route/Params 1",
    });
    await user.click(links[0]);
    const allHeaders = await screen.findAllByRole("heading", {
      name: /Ambiguous Test 1/i,
    });
    expect(allHeaders).toHaveLength(1);
    await waitFor(() =>
      expect(allHeaders[0].textContent).toBe("Ambiguous Test 1")
    );

    const paragraphs = document.querySelectorAll("p");
    expect(paragraphs).toHaveLength(2);
    expect(paragraphs[0].textContent).toBe("ID: 123");
    expect(location.pathname).toBe("/payments/123");
    let testButton = screen.getAllByRole("button", { name: /test/i });
    expect(testButton).toHaveLength(1);
    testButton[0].click();
    await waitFor(() => expect(paragraphs[0].textContent).toBe("ID: test"));
    expect(location.pathname).toBe("/payments/test");
  });

  it("Ambiguous Route/Params Link Works 2", async () => {
    const links = await screen.findAllByRole("link", {
      name: "Ambiguous Route/Params 2",
    });
    await user.click(links[0]);
    const allHeaders = await screen.findAllByRole("heading", {
      name: /Ambiguous Test 2/i,
    });
    expect(allHeaders).toHaveLength(1);
    await waitFor(() =>
      expect(allHeaders[0].textContent).toBe("Ambiguous Test 2")
    );

    const paragraphs = document.querySelectorAll("p");
    expect(paragraphs).toHaveLength(2);
    expect(paragraphs[0].textContent).toBe("ID: 321");
  });

  it("Nested Route Level 1", async () => {
    const links = await screen.findAllByRole("link", {
      name: "Nested Routes /users",
    });
    await user.click(links[0]);
    await delay(200);
    const testDiv = document.getElementById("nested-routes-test-id");
    expect(testDiv.innerHTML).toMatchSnapshot();

    router.routeRequest("/users");
    await delay(200);
    const testDiv2 = document.getElementById("nested-routes-test-id");
    expect(testDiv2.innerHTML).toMatchSnapshot();
  });

  it("Nested Route Level 3", async () => {
    const links = await screen.findAllByRole("link", {
      name: "Nested Routes /users/:id/settings",
    });
    await user.click(links[0]);
    await delay(200);
    const testDiv = document.getElementById("nested-routes-test-id");
    expect(testDiv.innerHTML).toMatchSnapshot();

    router.routeRequest("/users/953test/settings");
    await delay(200);
    const testDiv2 = document.getElementById("nested-routes-test-id");
    expect(testDiv2.innerHTML).toMatchSnapshot();
  });

  it("Nested Route Level 2", async () => {
    const links = await screen.findAllByRole("link", {
      name: "Nested Routes /users/:id",
    });
    await user.click(links[0]);
    await delay(200);
    const testDiv = document.getElementById("nested-routes-test-id");
    expect(testDiv.innerHTML).toMatchSnapshot();

    router.routeRequest("/users/953test");
    await delay(200);
    const testDiv2 = document.getElementById("nested-routes-test-id");
    expect(testDiv2.innerHTML).toMatchSnapshot();
  });

  it("Nested Route Level 4", async () => {
    const links = await screen.findAllByRole("link", {
      name: "Nested Routes /users/:id/settings/all/wild/card/stuff",
    });
    await user.click(links[0]);
    await delay(200);
    const testDiv = document.getElementById("nested-routes-test-id");
    expect(testDiv.innerHTML).toMatchSnapshot();

    router.routeRequest("/users/953test/settings/all/wild/card/stuff");
    await delay(200);
    const testDiv2 = document.getElementById("nested-routes-test-id");
    expect(testDiv2.innerHTML).toMatchSnapshot();
  });

  it("Nested Route Level 1 Again", async () => {
    const links = await screen.findAllByRole("link", {
      name: "Nested Routes /users",
    });
    await user.click(links[0]);
    await delay(100);
    const testDiv = document.getElementById("nested-routes-test-id");
    expect(testDiv.innerHTML).toMatchSnapshot();

    router.routeRequest("/users");
    await delay(100);
    const testDiv2 = document.getElementById("nested-routes-test-id");
    expect(testDiv2.innerHTML).toMatchSnapshot();
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
    router.routeRequest("/");

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

    expect(document.title).toBe("Testing Root Title");
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
    expect(paragraphs).toHaveLength(3);
    expect(paragraphs[0].textContent).toBe("ID: 5678");
    expect(paragraphs[1].textContent).toBe("Test Param: 1234");
  });

  it("JSX Signals", async () => {
    router.routeRequest("/jsx-signals");
    await delay(100);
    const allHeaders = await screen.findAllByRole("heading", {
      name: /JSX Signals/i,
    });
    expect(allHeaders).toHaveLength(1);
    await waitFor(() => expect(allHeaders[0].textContent).toBe("JSX Signals"));

    const jsxSignals = document.getElementById("jsx-signals-test-id");
    expect(jsxSignals).not.toMatchSnapshot();
  });

  it("MDX Route Click", async () => {
    const links = await screen.findAllByRole("link", {
      name: "MDX",
    });
    await user.click(links[0]);
    await delay(100);
    const allHeaders = await screen.findAllByRole("heading", {
      name: /Hello World Test asdf/i,
    });
    expect(allHeaders).toHaveLength(1);
    expect(document.body.innerHTML).toMatchSnapshot();
  });

  it("Data Fetching Route", async () => {
    router.routeRequest("/data-fetching");

    const allHeaders = await screen.findAllByRole("heading", {
      name: /Data Fetching/i,
    });
    expect(allHeaders).toHaveLength(1);

    const txt = await screen.findAllByText("Loading");
    expect(txt).toHaveLength(1);

    const loaded1 = await screen.findAllByText("test1-loaded");
    expect(loaded1).toHaveLength(1);

    const loaded2 = await screen.findAllByText("test2-loaded");
    expect(loaded2).toHaveLength(1);

    const loaded3 = await screen.findAllByText("test3-loaded");
    expect(loaded3).toHaveLength(1);
  });

  it("MDX Route", async () => {
    router.routeRequest("/mdx");
    await delay(100);
    const allHeaders = await screen.findAllByRole("heading", {
      name: /Hello World Test asdf/i,
    });
    expect(allHeaders).toHaveLength(1);
    expect(document.body.innerHTML).toMatchSnapshot();
  });

  it("Simple String List Route", async () => {
    router.routeRequest("/simple-string-list");
    await delay(100);
    const allHeaders = await screen.findAllByRole("heading", {
      name: /simple string list/i,
    });
    expect(allHeaders).toHaveLength(1);

    const routerOutlet = document.getElementById("router-outlet-test");
    expect(routerOutlet.innerHTML).toMatchSnapshot();
  });

  it("Route Guard redirects", async () => {
    router.beforeEach((to, from) => {
      expect(from.pathname).toBe("/simple-string-list");
      expect(to.pathname).toBe("/simple-string-list");
      return "/login";
    });
    router.routeChanged("/simple-string-list");
    await delay(100);
    const allHeaders = await screen.findAllByRole("heading", {
      name: /404 - Page Not Found/i,
    });
    expect(allHeaders).toHaveLength(1);

    expect(router.currentRoute.pathname).toBe("/login");
    router.beforeHooks = [];
  });

  it("Route Guard Reverts - Simple String List Route", async () => {
    router.routeChanged("/simple-string-list");
    await delay(100);
    const allHeaders = await screen.findAllByRole("heading", {
      name: /simple string list/i,
    });
    expect(allHeaders).toHaveLength(1);

    const routerOutlet = document.getElementById("router-outlet-test");
    expect(routerOutlet.innerHTML).toMatchSnapshot();
  });

  it("Route Guard Cancels Navigation - Simple String List Route", async () => {
    router.beforeEach((to, from) => {
      expect(to.pathname).toBe("/data-fetching");
      expect(from.pathname).toBe("/simple-string-list");
      return false;
    });
    router.routeChanged("/data-fetching");
    await delay(100);
    const allHeaders = await screen.findAllByRole("heading", {
      name: /simple string list/i,
    });
    expect(allHeaders).toHaveLength(1);

    const routerOutlet = document.getElementById("router-outlet-test");
    expect(routerOutlet.innerHTML).toMatchSnapshot();
    router.beforeHooks = [];
  });
});

function delay(n) {
  return new Promise((res) => setTimeout(res, n));
}
