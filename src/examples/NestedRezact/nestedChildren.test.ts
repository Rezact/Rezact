import { describe, expect, it } from "vitest";
// import { screen } from "@testing-library/dom";
import { render } from "src/lib/rezact/rezact";
import { Page } from "./NestedChildren";

describe("Nested suite", () => {
  it("Children are rendered in nested child component", () => {
    render(document.body, Page);
    // const allHeaders = screen.getAllByText(/hello world/i);
    expect(document.body.innerHTML).toMatchSnapshot();
  });
});
