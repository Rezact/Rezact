import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/dom";
import { render } from "rezact";
import { Page } from "./FormValidation";

describe("Form Validation suite", () => {
  it("Renders Form", () => {
    render(document.body, Page);
    const allHeaders = screen.getAllByText(/validator demo/i);
    expect(allHeaders).toHaveLength(1);
  });
});
