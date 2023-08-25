import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/dom";
import { render } from "rezact";
import { Page } from "./ShadowDom";

describe("Shadow DOM suite", () => {
  it("Renders an Element with scoped CSS using shadow DOM", () => {
    // render(document.body, Page);
    // const allHeaders = screen.getAllByText(/hello world/i);
    // expect(allHeaders).toHaveLength(1);
  });
});
