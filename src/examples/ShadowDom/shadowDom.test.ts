import { describe, expect, it } from "vitest";
import { render } from "rezact";
import { Page } from "./ShadowDomForTesting";

describe("Shadow DOM suite", () => {
  it("Renders an Element with scoped CSS using shadow DOM", () => {
    render(document.body, Page);
    expect(document.body.innerHTML).toMatchSnapshot();
  });

  it("renders a div element with a shadow root", () => {
    const div = document.querySelector("div");
    expect(div.shadowRoot.innerHTML).toMatchSnapshot();
  });
});
