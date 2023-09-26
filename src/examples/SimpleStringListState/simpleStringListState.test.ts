import { describe, expect, it } from "vitest";
import { render } from "rezact";
import { Page } from "./SimpleStringList";
import userEvent from "@testing-library/user-event";

const user = userEvent.setup();

describe("Simple String List State", () => {
  it("Renders both input list and output list", async () => {
    render(document.body, Page);
    await delay(100);
    expect(document.body.innerHTML).toMatchSnapshot();
  });

  it("updates state when input is changed", async () => {
    const inputs = document.querySelectorAll("input");
    await user.type(inputs[0], "hello");
    await user.type(inputs[1], "hello");
    await user.type(inputs[2], "hello");
    await user.type(inputs[3], "hello");

    await delay(100);

    expect(document.body.innerHTML).toMatchSnapshot();
  });
});

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
