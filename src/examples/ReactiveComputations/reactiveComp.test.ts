import { describe, expect, it } from "vitest";
import { screen, waitFor } from "@testing-library/dom";
import { render } from "rezact";
import { Page } from "./ReactiveComp";

describe("Reactive Computations", () => {
  it("Doubled", async () => {
    render(document.body, Page);
    const allHeaders = screen.getAllByText(/hello world/i);
    expect(allHeaders).toHaveLength(1);
    let button = await screen.findByRole("button");
    const ps = document.body.querySelectorAll("p");

    button.click();
    await waitFor(() => expect(ps[0].innerText).toBe("1"));
    await waitFor(() => expect(ps[1].innerText).toBe("2"));

    button.click();
    await waitFor(() => expect(ps[0].innerText).toBe("2"));
    await waitFor(() => expect(ps[1].innerText).toBe("4"));

    button.click();
    await waitFor(() => expect(ps[0].innerText).toBe("3"));
    await waitFor(() => expect(ps[1].innerText).toBe("6"));
  });
});
