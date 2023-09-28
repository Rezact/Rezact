import { describe, expect, it } from "vitest";
import { screen, waitFor } from "@testing-library/dom";
import { render } from "rezact";
import Page from "./ReactiveComp";

describe("Reactive Computations", () => {
  it("Doubled", async () => {
    render(document.body, Page);
    await delay(100); //give the framework a bit to render everything

    const allHeaders = screen.getAllByText(/hello world/i);
    expect(allHeaders).toHaveLength(1);
    let buttons: any = await screen.findAllByRole("button");
    const button = buttons[0];
    const ps = document.body.querySelectorAll("p");

    await button.click();
    await waitFor(() => expect(ps[0].innerText).toBe("1"));
    await waitFor(() => expect(ps[1].innerText).toBe("2"));

    await button.click();
    await waitFor(() => expect(ps[0].innerText).toBe("2"));
    await waitFor(() => expect(ps[1].innerText).toBe("4"));

    await button.click();
    await waitFor(() => expect(ps[0].innerText).toBe("3"));
    await waitFor(() => expect(ps[1].innerText).toBe("6"));
  });

  it("Is Composable", async () => {
    const buttons: any = await screen.findAllByRole("button");
    const button1 = buttons[1];
    const button2 = buttons[2];
    const button3 = buttons[3];

    expect(button1.textContent).toBe("0");
    expect(button2.textContent).toBe("0");
    expect(button3.textContent).toBe("0");

    await button1.click();

    expect(button1.textContent).toBe("1");
    expect(button2.textContent).toBe("1");
    expect(button3.textContent).toBe("1");

    await button2.click();

    expect(button1.textContent).toBe("2");
    expect(button2.textContent).toBe("2");
    expect(button3.textContent).toBe("2");

    await button3.click();

    expect(button1.textContent).toBe("4");
    expect(button2.textContent).toBe("4");
    expect(button3.textContent).toBe("4");
  });

  it("Issue 14 both sides of the binary expression are handled in the compiler", async () => {
    const div1 = document.getElementById("iss14-1");
    const div2 = document.getElementById("iss14-2");
    const div3 = document.getElementById("iss14-3");
    const div4 = document.getElementById("iss14-4");

    expect(div1?.textContent).toBe("Hallo, jesen");
    expect(div2?.textContent).toBe("width: 10");
    expect(div3?.textContent).toBe("height: 20");
    expect(div4?.textContent).toBe("area: 200");
  });
});

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
