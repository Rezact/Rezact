import { describe, expect, it } from "vitest";
// import { waitFor } from "@testing-library/dom";
import { render } from "rezact";
import Page from "./App";

describe("List Re-Render Tests", () => {
  it("items do not cause full list to re render", async () => {
    render(document.body, Page);
  });
});
