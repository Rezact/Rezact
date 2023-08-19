import { describe, expect, it } from "vitest";
import {
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { render } from "rezact";
import { Page } from "./HomePage";

const user = userEvent.setup();

describe("Kitchen Sink Suite", () => {
  it("First Render", () => {
    render(document.body, Page);
    const allHeaders = screen.getAllByText(/hello world/i);
    expect(allHeaders).toHaveLength(1);
    expect(allHeaders[0].textContent).toBe("Hello World TEST");

    let toggleButtons = screen.getAllByRole("button", { name: /toggle/i });
    expect(toggleButtons).toHaveLength(3);

    let deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    expect(deleteButtons).toHaveLength(3);
  });

  it("Test toggle buttons", async () => {
    const allHeaders = screen.getAllByText(/hello world/i);
    expect(allHeaders).toHaveLength(1);

    let toggleButtons = screen.getAllByRole("button", { name: /toggle/i });
    expect(toggleButtons).toHaveLength(3);
    await waitFor(() =>
      expect(toggleButtons[0].previousElementSibling.textContent).toBe(
        "0. apple On"
      )
    );
    await waitFor(() =>
      expect(toggleButtons[1].previousElementSibling.textContent).toBe(
        "1. orange On"
      )
    );
    await waitFor(() =>
      expect(toggleButtons[2].previousElementSibling.textContent).toBe(
        "2. banana On"
      )
    );

    toggleButtons[0].click();
    toggleButtons[1].click();
    toggleButtons[2].click();
    await waitFor(() =>
      expect(toggleButtons[0].previousElementSibling.textContent).toBe(
        "0. apple Off"
      )
    );
    await waitFor(() =>
      expect(toggleButtons[1].previousElementSibling.textContent).toBe(
        "1. orange Off"
      )
    );
    await waitFor(() =>
      expect(toggleButtons[2].previousElementSibling.textContent).toBe(
        "2. banana Off"
      )
    );

    toggleButtons[1].click();
    await waitFor(() =>
      expect(toggleButtons[0].previousElementSibling.textContent).toBe(
        "0. apple Off"
      )
    );
    await waitFor(() =>
      expect(toggleButtons[1].previousElementSibling.textContent).toBe(
        "1. orange On"
      )
    );
    await waitFor(() =>
      expect(toggleButtons[2].previousElementSibling.textContent).toBe(
        "2. banana Off"
      )
    );

    toggleButtons[0].click();
    await waitFor(() =>
      expect(toggleButtons[0].previousElementSibling.textContent).toBe(
        "0. apple On"
      )
    );
    await waitFor(() =>
      expect(toggleButtons[1].previousElementSibling.textContent).toBe(
        "1. orange On"
      )
    );
    await waitFor(() =>
      expect(toggleButtons[2].previousElementSibling.textContent).toBe(
        "2. banana Off"
      )
    );

    toggleButtons[2].click();
    await waitFor(() =>
      expect(toggleButtons[0].previousElementSibling.textContent).toBe(
        "0. apple On"
      )
    );
    await waitFor(() =>
      expect(toggleButtons[1].previousElementSibling.textContent).toBe(
        "1. orange On"
      )
    );
    await waitFor(() =>
      expect(toggleButtons[2].previousElementSibling.textContent).toBe(
        "2. banana On"
      )
    );
  });

  it("Click Boolean Show Hide", async () => {
    let clickToggleButton = screen.getAllByRole("button", { name: /clicked/i });
    expect(clickToggleButton).toHaveLength(1);

    let showHideHeader: any = screen.queryByText(/show hide test/i);
    if (showHideHeader) await waitForElementToBeRemoved(showHideHeader);
    expect(showHideHeader).toBeNull();
    expect(clickToggleButton[0].textContent).toBe("Clicked 0 times test");
    expect(clickToggleButton[0].classList.toString()).toBe("test sky");

    clickToggleButton[0].click();
    expect(clickToggleButton[0].classList.toString()).toBe("test pink");
    showHideHeader = await screen.findAllByText(/show hide test/i);
    expect(showHideHeader).toHaveLength(1);
    expect(showHideHeader[0].textContent).toBe("Show Hide Test test");
    expect(clickToggleButton[0].textContent).toBe("Clicked 1 time test");
    let toggleButtons = screen.getAllByRole("button", { name: /toggle/i });
    expect(toggleButtons).toHaveLength(4);
    await waitFor(() =>
      expect(toggleButtons[0].previousElementSibling.textContent).toBe(
        "0. apple On"
      )
    );
    await waitFor(() =>
      expect(toggleButtons[1].previousElementSibling.textContent).toBe(
        "1. orange On"
      )
    );
    await waitFor(() =>
      expect(toggleButtons[2].previousElementSibling.textContent).toBe(
        "2. banana On"
      )
    );
    await waitFor(() =>
      expect(toggleButtons[3].previousElementSibling.textContent).toBe(
        "3. asdf On"
      )
    );
    toggleButtons[3].click();
    await waitFor(() =>
      expect(toggleButtons[3].previousElementSibling.textContent).toBe(
        "3. asdf Off"
      )
    );

    clickToggleButton[0].click();
    showHideHeader = screen.queryByText(/show hide test/i);
    if (showHideHeader) await waitForElementToBeRemoved(showHideHeader);
    expect(showHideHeader).toBeNull();
    expect(clickToggleButton[0].textContent).toBe("Clicked 2 times test");
    toggleButtons = screen.getAllByRole("button", { name: /toggle/i });
    expect(toggleButtons).toHaveLength(5);
    await waitFor(() =>
      expect(toggleButtons[0].previousElementSibling.textContent).toBe(
        "0. apple On"
      )
    );
    await waitFor(() =>
      expect(toggleButtons[1].previousElementSibling.textContent).toBe(
        "1. orange On"
      )
    );
    await waitFor(() =>
      expect(toggleButtons[2].previousElementSibling.textContent).toBe(
        "2. banana On"
      )
    );
    await waitFor(() =>
      expect(toggleButtons[3].previousElementSibling.textContent).toBe(
        "3. asdf Off"
      )
    );
    await waitFor(() =>
      expect(toggleButtons[4].previousElementSibling.textContent).toBe(
        "4. asdf On"
      )
    );

    toggleButtons[3].click();
    await waitFor(() =>
      expect(toggleButtons[3].previousElementSibling.textContent).toBe(
        "3. asdf On"
      )
    );

    clickToggleButton[0].click();
    showHideHeader = await screen.findAllByText(/show hide test/i);
    expect(showHideHeader).toHaveLength(1);
    expect(showHideHeader[0].textContent).toBe("Show Hide Test test");
    expect(clickToggleButton[0].textContent).toBe("Clicked 3 times test");
    toggleButtons = screen.getAllByRole("button", { name: /toggle/i });
    expect(toggleButtons).toHaveLength(6);
    await waitFor(() =>
      expect(toggleButtons[0].previousElementSibling.textContent).toBe(
        "0. apple On"
      )
    );
    await waitFor(() =>
      expect(toggleButtons[1].previousElementSibling.textContent).toBe(
        "1. orange On"
      )
    );
    await waitFor(() =>
      expect(toggleButtons[2].previousElementSibling.textContent).toBe(
        "2. banana On"
      )
    );
    await waitFor(() =>
      expect(toggleButtons[3].previousElementSibling.textContent).toBe(
        "3. asdf On"
      )
    );
    await waitFor(() =>
      expect(toggleButtons[4].previousElementSibling.textContent).toBe(
        "4. asdf On"
      )
    );
    await waitFor(() =>
      expect(toggleButtons[5].previousElementSibling.textContent).toBe(
        "5. asdf On"
      )
    );

    toggleButtons[4].click();
    await waitFor(() =>
      expect(toggleButtons[4].previousElementSibling.textContent).toBe(
        "4. asdf Off"
      )
    );
  });

  it("Input Text Binding", async () => {
    const inp: any = screen.getByLabelText("Test Input");
    inp.focus();
    await user.keyboard("Hello");
    expect(inp.value).toBe("testHello");
    let headers = screen.getAllByRole("heading");
    await waitFor(() =>
      expect(headers[0].textContent).toBe("Hello World TESTHELLO")
    );
    await waitFor(() =>
      expect(headers[1].textContent).toBe("Show Hide Test testHello")
    );

    const clickToggleButton = screen.getByRole("button", {
      name: /clicked/i,
    });
    await waitFor(() =>
      expect(clickToggleButton.textContent).toBe("Clicked 3 times testHello")
    );

    const asdfButton = screen.getByRole("button", { name: /asdf/i });
    asdfButton.click();

    let toggleButtons = screen.getAllByRole("button", { name: /toggle/i });
    expect(toggleButtons).toHaveLength(7);
    await waitFor(() =>
      expect(toggleButtons[0].previousElementSibling.textContent).toBe(
        "0. apple On"
      )
    );
    await waitFor(() =>
      expect(toggleButtons[1].previousElementSibling.textContent).toBe(
        "1. orange On"
      )
    );
    await waitFor(() =>
      expect(toggleButtons[2].previousElementSibling.textContent).toBe(
        "2. banana On"
      )
    );
    await waitFor(() =>
      expect(toggleButtons[3].previousElementSibling.textContent).toBe(
        "3. asdf On"
      )
    );
    await waitFor(() =>
      expect(toggleButtons[4].previousElementSibling.textContent).toBe(
        "4. asdf Off"
      )
    );
    await waitFor(() =>
      expect(toggleButtons[5].previousElementSibling.textContent).toBe(
        "5. asdf On"
      )
    );
    await waitFor(() =>
      expect(toggleButtons[6].previousElementSibling.textContent).toBe(
        "6. testHello On"
      )
    );

    await user.clear(inp);
    headers = screen.getAllByRole("heading");
    expect(headers[0].textContent).toBe("Hello World ");
    await waitFor(() => expect(headers[1].textContent).toBe("Show Hide Test "));

    inp.focus();
    await user.keyboard("Another Line Item");
    headers = screen.getAllByRole("heading");
    await waitFor(() =>
      expect(headers[0].textContent).toBe("Hello World ANOTHER LINE ITEM")
    );
    await waitFor(() =>
      expect(headers[1].textContent).toBe("Show Hide Test Another Line Item")
    );
    asdfButton.click();

    toggleButtons = screen.getAllByRole("button", { name: /toggle/i });
    expect(toggleButtons).toHaveLength(8);
    await waitFor(() =>
      expect(toggleButtons[0].previousElementSibling.textContent).toBe(
        "0. apple On"
      )
    );
    await waitFor(() =>
      expect(toggleButtons[1].previousElementSibling.textContent).toBe(
        "1. orange On"
      )
    );
    await waitFor(() =>
      expect(toggleButtons[2].previousElementSibling.textContent).toBe(
        "2. banana On"
      )
    );
    await waitFor(() =>
      expect(toggleButtons[3].previousElementSibling.textContent).toBe(
        "3. asdf On"
      )
    );
    await waitFor(() =>
      expect(toggleButtons[4].previousElementSibling.textContent).toBe(
        "4. asdf Off"
      )
    );
    await waitFor(() =>
      expect(toggleButtons[5].previousElementSibling.textContent).toBe(
        "5. asdf On"
      )
    );
    await waitFor(() =>
      expect(toggleButtons[6].previousElementSibling.textContent).toBe(
        "6. testHello On"
      )
    );
    await waitFor(() =>
      expect(toggleButtons[7].previousElementSibling.textContent).toBe(
        "7. Another Line Item On"
      )
    );
  });

  it("Delete Items Buttons", async () => {
    let deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    expect(deleteButtons).toHaveLength(8);

    deleteButtons[2].click();
    let toggleButtons = screen.getAllByRole("button", { name: /toggle/i });
    expect(toggleButtons).toHaveLength(7);
    await waitFor(() =>
      expect(toggleButtons[0].previousElementSibling.textContent).toBe(
        "0. apple On"
      )
    );
    await waitFor(() =>
      expect(toggleButtons[1].previousElementSibling.textContent).toBe(
        "1. orange On"
      )
    );
    await waitFor(() =>
      expect(toggleButtons[2].previousElementSibling.textContent).toBe(
        "2. asdf On"
      )
    );
    await waitFor(() =>
      expect(toggleButtons[3].previousElementSibling.textContent).toBe(
        "3. asdf Off"
      )
    );
    await waitFor(() =>
      expect(toggleButtons[4].previousElementSibling.textContent).toBe(
        "4. asdf On"
      )
    );
    await waitFor(() =>
      expect(toggleButtons[5].previousElementSibling.textContent).toBe(
        "5. testHello On"
      )
    );
    await waitFor(() =>
      expect(toggleButtons[6].previousElementSibling.textContent).toBe(
        "6. Another Line Item On"
      )
    );

    deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    expect(deleteButtons).toHaveLength(7);
    deleteButtons[3].click();
    toggleButtons = screen.getAllByRole("button", { name: /toggle/i });
    expect(toggleButtons).toHaveLength(6);
    await waitFor(() =>
      expect(toggleButtons[0].previousElementSibling.textContent).toBe(
        "0. apple On"
      )
    );
    await waitFor(() =>
      expect(toggleButtons[1].previousElementSibling.textContent).toBe(
        "1. orange On"
      )
    );
    await waitFor(() =>
      expect(toggleButtons[2].previousElementSibling.textContent).toBe(
        "2. asdf On"
      )
    );
    await waitFor(() =>
      expect(toggleButtons[3].previousElementSibling.textContent).toBe(
        "3. asdf On"
      )
    );
    await waitFor(() =>
      expect(toggleButtons[4].previousElementSibling.textContent).toBe(
        "4. testHello On"
      )
    );
    await waitFor(() =>
      expect(toggleButtons[5].previousElementSibling.textContent).toBe(
        "5. Another Line Item On"
      )
    );

    deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    expect(deleteButtons).toHaveLength(6);
    deleteButtons[0].click();
    toggleButtons = screen.getAllByRole("button", { name: /toggle/i });
    expect(toggleButtons).toHaveLength(5);
    await waitFor(() =>
      expect(toggleButtons[0].previousElementSibling.textContent).toBe(
        "0. orange On"
      )
    );
    await waitFor(() =>
      expect(toggleButtons[1].previousElementSibling.textContent).toBe(
        "1. asdf On"
      )
    );
    await waitFor(() =>
      expect(toggleButtons[2].previousElementSibling.textContent).toBe(
        "2. asdf On"
      )
    );
    await waitFor(() =>
      expect(toggleButtons[3].previousElementSibling.textContent).toBe(
        "3. testHello On"
      )
    );
    await waitFor(() =>
      expect(toggleButtons[4].previousElementSibling.textContent).toBe(
        "4. Another Line Item On"
      )
    );

    deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    expect(deleteButtons).toHaveLength(5);
    deleteButtons[4].click();
    toggleButtons = screen.getAllByRole("button", { name: /toggle/i });
    expect(toggleButtons).toHaveLength(4);
    await waitFor(() =>
      expect(toggleButtons[0].previousElementSibling.textContent).toBe(
        "0. orange On"
      )
    );
    await waitFor(() =>
      expect(toggleButtons[1].previousElementSibling.textContent).toBe(
        "1. asdf On"
      )
    );
    await waitFor(() =>
      expect(toggleButtons[2].previousElementSibling.textContent).toBe(
        "2. asdf On"
      )
    );
    await waitFor(() =>
      expect(toggleButtons[3].previousElementSibling.textContent).toBe(
        "3. testHello On"
      )
    );

    deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    expect(deleteButtons).toHaveLength(4);
    deleteButtons[1].click();
    deleteButtons[2].click();
    toggleButtons = screen.getAllByRole("button", { name: /toggle/i });
    expect(toggleButtons).toHaveLength(2);
    await waitFor(() =>
      expect(toggleButtons[0].previousElementSibling.textContent).toBe(
        "0. orange On"
      )
    );
    await waitFor(() =>
      expect(toggleButtons[1].previousElementSibling.textContent).toBe(
        "1. testHello On"
      )
    );

    const asdfButton = screen.getByRole("button", { name: /asdf/i });
    asdfButton.click();

    toggleButtons = screen.getAllByRole("button", { name: /toggle/i });
    expect(toggleButtons).toHaveLength(3);
    await waitFor(() =>
      expect(toggleButtons[0].previousElementSibling.textContent).toBe(
        "0. orange On"
      )
    );
    await waitFor(() =>
      expect(toggleButtons[1].previousElementSibling.textContent).toBe(
        "1. testHello On"
      )
    );
    await waitFor(() =>
      expect(toggleButtons[2].previousElementSibling.textContent).toBe("2.  On")
    );

    deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    expect(deleteButtons).toHaveLength(3);
    deleteButtons[0].click();
    deleteButtons[1].click();
    deleteButtons[2].click();
    toggleButtons = screen.queryAllByRole("button", { name: /toggle/i });
    expect(toggleButtons).toHaveLength(0);

    const inp = screen.getByLabelText("Test Input");
    inp.focus();
    await user.keyboard("Hello");
    asdfButton.click();

    toggleButtons = screen.getAllByRole("button", { name: /toggle/i });
    expect(toggleButtons).toHaveLength(1);
    await waitFor(() =>
      expect(toggleButtons[0].previousElementSibling.textContent).toBe(
        "0. Hello On"
      )
    );
    toggleButtons[0].click();
    await waitFor(() =>
      expect(toggleButtons[0].previousElementSibling.textContent).toBe(
        "0. Hello Off"
      )
    );

    inp.focus();
    await user.keyboard("Hello Again");
    asdfButton.click();

    toggleButtons = screen.getAllByRole("button", { name: /toggle/i });
    expect(toggleButtons).toHaveLength(2);
    await waitFor(() =>
      expect(toggleButtons[0].previousElementSibling.textContent).toBe(
        "0. Hello Off"
      )
    );
    await waitFor(() =>
      expect(toggleButtons[1].previousElementSibling.textContent).toBe(
        "1. Hello Again On"
      )
    );

    deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    expect(deleteButtons).toHaveLength(2);
    deleteButtons[0].click();
    deleteButtons[1].click();
    toggleButtons = screen.queryAllByRole("button", { name: /toggle/i });
    expect(toggleButtons).toHaveLength(0);
  });
});
