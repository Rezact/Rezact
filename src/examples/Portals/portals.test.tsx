import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/dom";
import { render } from "rezact";
import { Page } from "./Portals";
import { delay } from "src/lib/utils";

function Layout() {
  return (
    <>
      <Page />
      <div id="portal-out"></div>
    </>
  );
}

describe("Portal Test Suite", () => {
  it("Portal Test", async () => {
    render(document.body, Layout);
    await delay(100);

    const allHeaders = screen.getAllByText(/portals/i);
    expect(allHeaders).toHaveLength(1);
    expect(document.body.innerHTML).toMatchSnapshot();

    const clickToggleButton = screen.getByRole("button", {
      name: /toggle portal/i,
    });

    clickToggleButton.click();
    await delay(100);
    expect(document.body.innerHTML).toMatchSnapshot();

    const closePortalButton = screen.getByRole("button", {
      name: /toggle portal/i,
    });
    closePortalButton.click();
    await delay(100);
    expect(document.body.innerHTML).toMatchSnapshot();

    clickToggleButton.click();
    await delay(100);
    expect(document.body.innerHTML).toMatchSnapshot();

    clickToggleButton.click();
    await delay(100);
    expect(document.body.innerHTML).toMatchSnapshot();
  });
});
