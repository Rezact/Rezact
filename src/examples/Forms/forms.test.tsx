import { describe, expect, it } from "vitest";
import { screen, waitForElementToBeRemoved } from "@testing-library/dom";
import { render } from "rezact";

function Form() {
  return (
    <form>
      <h1>Forms and Inputs</h1>
    </form>
  );
}

describe("Forms suite", () => {
  it("renders a form", () => {
    render(document.body, Form);
  });
});
