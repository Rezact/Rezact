import { describe, expect, it } from "vitest";
import { screen, waitFor } from "@testing-library/dom";
import { render } from "rezact";
import TestMdx from "./Test.mdx";

import userEvent from "@testing-library/user-event";

const user = userEvent.setup();

describe("MDX suite", () => {
  it("renders MDX", async () => {
    render(document.body, TestMdx);

    expect(document.body.innerHTML).toMatchSnapshot();

    const allHeaders = await screen.findAllByRole("heading", {
      name: /hello world/i,
    });
    expect(allHeaders).toHaveLength(1);
    expect(allHeaders[0].textContent).toBe("Hello World Test asdf");

    const testBtn = await screen.findAllByRole("button", {
      name: "Test",
    });
    testBtn[0].click();

    await waitFor(() =>
      expect(allHeaders[0].textContent).toBe("Hello World Test cool stuff!")
    );

    const inp = document.querySelector("input");
    inp.focus();
    await user.keyboard("Hello");

    await waitFor(() =>
      expect(allHeaders[0].textContent).toBe(
        "Hello World Test cool stuff!Hello"
      )
    );

    testBtn[0].click();

    await waitFor(() =>
      expect(allHeaders[0].textContent).toBe("Hello World Test asdf")
    );
  });
});
