import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/dom";
import { render } from "rezact";
import { Page } from "./ComponentContext";

describe("Component Context suite", () => {
  it("Renders Component Context Demo", () => {
    render(document.body, Page);
    const allHeaders = screen.getAllByText(/component context/i);
    expect(allHeaders).toHaveLength(1);
  });

  it("has empty initial state", () => {
    const allParagraphs = document.querySelectorAll("p");
    expect(allParagraphs).toHaveLength(8);
    const p1 = allParagraphs[0];
    const p2 = allParagraphs[1];
    const p3 = allParagraphs[2];
    const p4 = allParagraphs[3];

    expect(p1.textContent).toBe("Select 1 value: ");
    expect(p2.textContent).toBe("Select 2 value: ");
    expect(p3.textContent).toBe("Select 3 value: ");
    expect(p4.textContent).toBe("Select 4 value: ");
  });

  it("Updates state when option component is clicked", async () => {
    const allParagraphs = document.querySelectorAll("p");
    expect(allParagraphs).toHaveLength(8);
    const p1 = allParagraphs[0];
    const p2 = allParagraphs[1];
    const p3 = allParagraphs[2];
    const p4 = allParagraphs[3];

    const options = document.querySelectorAll(".option");
    expect(options).toHaveLength(12);

    const select1opt1: any = options[0];
    const select1opt2: any = options[1];
    const select1opt3: any = options[2];
    const select2opt1: any = options[3];
    const select2opt2: any = options[4];
    const select2opt3: any = options[5];
    const select3opt1: any = options[6];
    const select3opt2: any = options[7];
    const select3opt3: any = options[8];
    const select4opt1: any = options[9];
    const select4opt2: any = options[10];
    const select4opt3: any = options[11];

    select1opt2.click();
    expect(p1.textContent).toBe("Select 1 value: Opt 2");

    select2opt3.click();
    expect(p2.textContent).toBe("Select 2 value: Opt 3");

    select3opt1.click();
    expect(p3.textContent).toBe("Select 3 value: Opt 1");

    select4opt2.click();
    expect(p4.textContent).toBe("Select 4 value: Opt 2");

    select1opt1.click();
    expect(p1.textContent).toBe("Select 1 value: Opt 1");

    select2opt2.click();
    expect(p2.textContent).toBe("Select 2 value: Opt 2");

    select3opt3.click();
    expect(p3.textContent).toBe("Select 3 value: Opt 3");

    select4opt1.click();
    expect(p4.textContent).toBe("Select 4 value: Opt 1");

    select1opt3.click();
    expect(p1.textContent).toBe("Select 1 value: Opt 3");

    select2opt1.click();
    expect(p2.textContent).toBe("Select 2 value: Opt 1");

    select3opt2.click();
    expect(p3.textContent).toBe("Select 3 value: Opt 2");

    select4opt3.click();
    expect(p4.textContent).toBe("Select 4 value: Opt 3");
  });
});
