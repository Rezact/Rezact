import { describe, expect, it } from "vitest";
import { screen, waitFor } from "@testing-library/dom";
import { render } from "src/lib/rezact/rezact";
import { Page } from "./Benchmark";
import userEvent from "@testing-library/user-event";

const user = userEvent.setup();

describe("Benchmark Suite", () => {
  it("Has Rezact Header", () => {
    render(document.body, Page);
    const allHeaders = screen.getAllByText(/Rezact/i);
    expect(allHeaders).toHaveLength(1);
  });

  it("Creates 1000 rows", async () => {
    screen.getByText(/Create 1,000 rows/i).click();
    const tbody = document.querySelector("tbody");
    await waitFor(() => expect(tbody.childElementCount).toBe(1000));
    expect(tbody.children[0].textContent[0]).toBe("1");
    expect(tbody.children[999].textContent.slice(0, 4)).toBe("1000");
  });

  it("Appends 1000 rows", async () => {
    screen.getByText(/Append 1,000 rows/i).click();
    const tbody = document.querySelector("tbody");
    await waitFor(() => expect(tbody.childElementCount).toBe(2000));
    expect(tbody.children[1000].textContent.slice(0, 4)).toBe("1001");
    expect(tbody.children[1999].textContent.slice(0, 4)).toBe("2000");
  });

  it("Selects and Highlights a row", async () => {
    let tbody = document.querySelector("tbody");
    const aLink1 = tbody.children[1].querySelector("a");
    const aLink2 = tbody.children[2].querySelector("a");
    await user.click(aLink2);
    await waitFor(() =>
      expect(tbody.children[2].classList.toString()).toBe("danger")
    );
    await user.click(aLink1);
    await waitFor(() =>
      expect(tbody.children[1].classList.toString()).toBe("danger")
    );
    expect(tbody.children[2].classList.toString()).not.toBe("danger");
  });

  it("Swaps Rows", async () => {
    const tbody = document.querySelector("tbody");
    const row2 = tbody.children[1].textContent;
    const row999 = tbody.children[998].textContent;
    screen.getByText(/Swap Rows/i).click();
    expect(tbody.children[1].textContent).toBe(row999);
    expect(tbody.children[998].textContent).toBe(row2);
    expect(tbody.children[998].classList.toString()).toBe("danger");
    screen.getByText(/Swap Rows/i).click();
    expect(tbody.children[1].textContent).toBe(row2);
    expect(tbody.children[998].textContent).toBe(row999);
    expect(tbody.children[1].classList.toString()).toBe("danger");
  });

  it("Updates every 10th row", async () => {
    const tbody = document.querySelector("tbody");
    expect(tbody.children[0].textContent.slice(-3)).not.toBe("!!!");
    expect(tbody.children[10].textContent.slice(-3)).not.toBe("!!!");
    expect(tbody.children[20].textContent.slice(-3)).not.toBe("!!!");
    expect(tbody.children[30].textContent.slice(-3)).not.toBe("!!!");

    screen.getByText(/Update every 10th row/i).click();
    await waitFor(() =>
      expect(tbody.children[0].textContent.slice(-3)).toBe("!!!")
    );
    expect(tbody.children[10].textContent.slice(-3)).toBe("!!!");
    expect(tbody.children[20].textContent.slice(-3)).toBe("!!!");
    expect(tbody.children[30].textContent.slice(-3)).toBe("!!!");

    screen.getByText(/Update every 10th row/i).click();
    await waitFor(() =>
      expect(tbody.children[0].textContent.slice(-7)).toBe("!!! !!!")
    );
    expect(tbody.children[10].textContent.slice(-7)).toBe("!!! !!!");
    expect(tbody.children[20].textContent.slice(-7)).toBe("!!! !!!");
    expect(tbody.children[30].textContent.slice(-7)).toBe("!!! !!!");

    screen.getByText(/Update every 10th row/i).click();
    await waitFor(() =>
      expect(tbody.children[0].textContent.slice(-11)).toBe("!!! !!! !!!")
    );
    expect(tbody.children[10].textContent.slice(-11)).toBe("!!! !!! !!!");
    expect(tbody.children[20].textContent.slice(-11)).toBe("!!! !!! !!!");
    expect(tbody.children[30].textContent.slice(-11)).toBe("!!! !!! !!!");
  });

  it("Deletes some rows", async () => {
    const tbody = document.querySelector("tbody");
    expect(tbody.children[1].classList.toString()).toBe("danger");
    expect(tbody.children[10].textContent.slice(-11)).toBe("!!! !!! !!!");

    tbody.children[1].querySelectorAll("a")[1].click();
    expect(tbody.children[1].classList.toString()).not.toBe("danger");
    expect(tbody.children[10].textContent.slice(-11)).not.toBe("!!! !!! !!!");
    expect(tbody.children[9].textContent.slice(-11)).toBe("!!! !!! !!!");

    tbody.children[1].querySelectorAll("a")[1].click();
    expect(tbody.children[9].textContent.slice(-11)).not.toBe("!!! !!! !!!");
    expect(tbody.children[8].textContent.slice(-11)).toBe("!!! !!! !!!");

    tbody.children[1].querySelectorAll("a")[1].click();
    expect(tbody.children[8].textContent.slice(-11)).not.toBe("!!! !!! !!!");
    expect(tbody.children[7].textContent.slice(-11)).toBe("!!! !!! !!!");
  });

  it("Clears Rows", async () => {
    screen.getByRole("button", { name: /Clear/i }).click();
    const tbody = document.querySelector("tbody");
    await waitFor(() => expect(tbody.children).toHaveLength(0));
  });

  it("Creates Another 1,000 Rows", async () => {
    screen.getByRole("button", { name: /Append/i }).click();
    const tbody = document.querySelector("tbody");
    await waitFor(() => expect(tbody.children).toHaveLength(1000));
    expect(tbody.children[0].textContent.slice(0, 4)).toBe("2001");
    expect(tbody.children[999].textContent.slice(0, 4)).toBe("3000");
  });
});

// function delay(n) {
//   return new Promise((res) => setTimeout(res, n));
// }
