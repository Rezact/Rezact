import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/dom";
import { render } from "src/lib/rezact/rezact";
import { Page } from "./HelloWorldMultiple";

describe("multiple hello world suite", () => {
  it("Multiple Hello World", () => {
    render(document.body, Page);
    const allHeaders = screen.getAllByText(/hello world/i);
    expect(allHeaders).toHaveLength(10);
  });
});
