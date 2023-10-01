import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/dom";
import { render } from "rezact";
import { Page } from "./EscapeHatches";
import { delay } from "src/lib/utils";

describe("Escape Hatch suite", () => {
  it("Renders Escape Hatch Demo", async () => {
    render(document.body, Page);
    await delay(1000);
    const allHeaders = screen.getAllByText(/hello world/i);
    expect(allHeaders).toHaveLength(1);

    expect(document.body.innerHTML).toMatchSnapshot();
  });
});
