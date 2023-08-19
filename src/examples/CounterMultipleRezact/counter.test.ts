import { describe, expect, it } from "vitest";
import { screen, waitFor } from "@testing-library/dom";
import { render } from "src/lib/rezact/rezact";
import { Page } from "./CounterMultiple";

describe("counter multiple suite name", () => {
  it("Counter Multiple", async () => {
    render(document.body, Page);
    const allHeaders = screen.getAllByText(/hello world/i);
    expect(allHeaders).toHaveLength(1);
    let buttons = await screen.findAllByRole("button");
    expect(buttons).toHaveLength(10);

    buttons[0].click();
    await waitFor(() => expect(buttons[0].textContent).toBe("Clicked 1 time"));
    await waitFor(() => expect(buttons[1].textContent).toBe("Clicked 0 times"));

    buttons[0].click();
    await waitFor(() => expect(buttons[0].textContent).toBe("Clicked 2 times"));
    await waitFor(() => expect(buttons[1].textContent).toBe("Clicked 0 times"));

    buttons[0].click();
    await waitFor(() => expect(buttons[0].textContent).toBe("Clicked 3 times"));
    await waitFor(() => expect(buttons[1].textContent).toBe("Clicked 0 times"));

    buttons[1].click();
    await waitFor(() => expect(buttons[0].textContent).toBe("Clicked 3 times"));
    await waitFor(() => expect(buttons[1].textContent).toBe("Clicked 1 time"));

    buttons[2].click();
    await waitFor(() => expect(buttons[0].textContent).toBe("Clicked 3 times"));
    await waitFor(() => expect(buttons[1].textContent).toBe("Clicked 1 time"));
    await waitFor(() => expect(buttons[2].textContent).toBe("Clicked 1 time"));

    buttons[2].click();
    await waitFor(() => expect(buttons[0].textContent).toBe("Clicked 3 times"));
    await waitFor(() => expect(buttons[1].textContent).toBe("Clicked 1 time"));
    await waitFor(() => expect(buttons[2].textContent).toBe("Clicked 2 times"));
    await waitFor(() => expect(buttons[3].textContent).toBe("Clicked 0 times"));
    await waitFor(() => expect(buttons[4].textContent).toBe("Clicked 0 times"));
    await waitFor(() => expect(buttons[5].textContent).toBe("Clicked 0 times"));
    await waitFor(() => expect(buttons[6].textContent).toBe("Clicked 0 times"));
    await waitFor(() => expect(buttons[7].textContent).toBe("Clicked 0 times"));
    await waitFor(() => expect(buttons[8].textContent).toBe("Clicked 0 times"));
    await waitFor(() => expect(buttons[9].textContent).toBe("Clicked 0 times"));
  });
});
