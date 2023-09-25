import { describe, expect, it } from "vitest";
// import { waitFor } from "@testing-library/dom";
import { render } from "rezact";
import Page from "./App";
import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

const user = userEvent.setup();

describe("List Re-Render Tests", () => {
  it("items do not cause full list to re render", async () => {
    render(document.body, Page);
    expect(screen.getByText("Cart")).not.toBeNull();
    await delay(100); //give the framework a bit to render everything

    const addButton = screen.getByRole("button", { name: "add one" });

    // ======== first add =========
    await user.click(addButton);
    await delay(100);

    expect(screen.getByText("price:")).not.toBeNull();
    expect(screen.getByText("quantity:")).not.toBeNull();

    let inputs = document.querySelectorAll("input");
    let hslBoxes: any = document.querySelectorAll("span>div");

    expect(inputs.length).toBe(2);
    expect(hslBoxes.length).toBe(2);

    let render1 = hslBoxes[0].dataset.render;
    let render2 = hslBoxes[1].dataset.render;
    let total = hslBoxes[1].parentElement.parentElement.children[0].textContent;

    expect(render1).toBe("6");
    expect(render2).toBe("3");
    expect(total).toBe("2");
  });

  it("second addition", async () => {
    const addButton = screen.getByRole("button", { name: "add one" });

    // ======== second add =========
    await user.click(addButton);
    await delay(100);

    let inputs = document.querySelectorAll("input");
    let hslBoxes: any = document.querySelectorAll("span>div");

    expect(inputs.length).toBe(4);
    expect(hslBoxes.length).toBe(3);

    let render1 = hslBoxes[0].dataset.render;
    let render2 = hslBoxes[1].dataset.render;
    let render3 = hslBoxes[2].dataset.render;
    let total = hslBoxes[2].parentElement.parentElement.children[0].textContent;

    expect(render1).toBe("6");
    expect(render2).toBe("11");
    expect(render3).toBe("8");
    expect(total).toBe("4");
  });

  it("third addition", async () => {
    const addButton = screen.getByRole("button", { name: "add one" });

    // ======== third add =========
    await user.click(addButton);
    await delay(100);

    let inputs = document.querySelectorAll("input");
    let hslBoxes: any = document.querySelectorAll("span>div");

    expect(inputs.length).toBe(6);
    expect(hslBoxes.length).toBe(4);

    let render1 = hslBoxes[0].dataset.render;
    let render2 = hslBoxes[1].dataset.render;
    let render3 = hslBoxes[2].dataset.render;
    let render4 = hslBoxes[3].dataset.render;
    let total = hslBoxes[3].parentElement.parentElement.children[0].textContent;

    expect(render1).toBe("6");
    expect(render2).toBe("11");
    expect(render3).toBe("16");
    expect(render4).toBe("13");
    expect(total).toBe("6");
  });

  it("fourth addition", async () => {
    const addButton = screen.getByRole("button", { name: "add one" });

    // ======== fourth add =========
    await user.click(addButton);
    await delay(100);

    let inputs = document.querySelectorAll("input");
    let hslBoxes: any = document.querySelectorAll("span>div");

    expect(inputs.length).toBe(8);
    expect(hslBoxes.length).toBe(5);

    let render1 = hslBoxes[0].dataset.render;
    let render2 = hslBoxes[1].dataset.render;
    let render3 = hslBoxes[2].dataset.render;
    let render4 = hslBoxes[3].dataset.render;
    let render5 = hslBoxes[4].dataset.render;
    let total = hslBoxes[4].parentElement.parentElement.children[0].textContent;

    expect(render1).toBe("6");
    expect(render2).toBe("11");
    expect(render3).toBe("16");
    expect(render4).toBe("21");
    expect(render5).toBe("18");
    expect(total).toBe("8");
  });

  it("editing second item price", async () => {
    const inputs = document.querySelectorAll("input");
    const input2 = inputs[2];

    await user.type(input2, "1");
    await delay(100);

    let hslBoxes: any = document.querySelectorAll("span>div");

    let render1 = hslBoxes[0].dataset.render;
    let render2 = hslBoxes[1].dataset.render;
    let render3 = hslBoxes[2].dataset.render;
    let render4 = hslBoxes[3].dataset.render;
    let render5 = hslBoxes[4].dataset.render;
    let total = hslBoxes[4].parentElement.parentElement.children[0].textContent;

    expect(render1).toBe("6");
    expect(render2).toBe("22");
    expect(render3).toBe("16");
    expect(render4).toBe("21");
    expect(render5).toBe("23");
    expect(total).toBe("27");
  });

  it("editing second item qty", async () => {
    const inputs = document.querySelectorAll("input");
    const input2 = inputs[3];

    await user.type(input2, "1");
    await delay(100);

    let hslBoxes: any = document.querySelectorAll("span>div");

    let render1 = hslBoxes[0].dataset.render;
    let render2 = hslBoxes[1].dataset.render;
    let render3 = hslBoxes[2].dataset.render;
    let render4 = hslBoxes[3].dataset.render;
    let render5 = hslBoxes[4].dataset.render;
    let total = hslBoxes[4].parentElement.parentElement.children[0].textContent;

    expect(render1).toBe("6");
    expect(render2).toBe("24");
    expect(render3).toBe("16");
    expect(render4).toBe("21");
    expect(render5).toBe("25");
    expect(total).toBe("237");
  });

  it("editing third item price", async () => {
    const inputs = document.querySelectorAll("input");
    const input2 = inputs[4];

    await user.type(input2, "1");
    await delay(100);

    let hslBoxes: any = document.querySelectorAll("span>div");

    let render1 = hslBoxes[0].dataset.render;
    let render2 = hslBoxes[1].dataset.render;
    let render3 = hslBoxes[2].dataset.render;
    let render4 = hslBoxes[3].dataset.render;
    let render5 = hslBoxes[4].dataset.render;
    let total = hslBoxes[4].parentElement.parentElement.children[0].textContent;

    expect(render1).toBe("6");
    expect(render2).toBe("24");
    expect(render3).toBe("26");
    expect(render4).toBe("21");
    expect(render5).toBe("27");
    expect(total).toBe("256");
  });

  it("editing third item qty", async () => {
    const inputs = document.querySelectorAll("input");
    const input2 = inputs[5];

    await user.type(input2, "1");
    await delay(100);

    let hslBoxes: any = document.querySelectorAll("span>div");

    let render1 = hslBoxes[0].dataset.render;
    let render2 = hslBoxes[1].dataset.render;
    let render3 = hslBoxes[2].dataset.render;
    let render4 = hslBoxes[3].dataset.render;
    let render5 = hslBoxes[4].dataset.render;
    let total = hslBoxes[4].parentElement.parentElement.children[0].textContent;

    expect(render1).toBe("6");
    expect(render2).toBe("24");
    expect(render3).toBe("28");
    expect(render4).toBe("21");
    expect(render5).toBe("29");
    expect(total).toBe("466");
  });

  it("remove fourth item", async () => {
    const removeButtons = screen.getAllByRole("button", { name: "remove" });
    const removeButton = removeButtons[3];

    await user.click(removeButton);
    await delay(100);

    let hslBoxes: any = document.querySelectorAll("span>div");

    let render1 = hslBoxes[0].dataset.render;
    let render2 = hslBoxes[1].dataset.render;
    let render3 = hslBoxes[2].dataset.render;
    let render4 = hslBoxes[3].dataset.render;
    let total = hslBoxes[3].parentElement.parentElement.children[0].textContent;

    expect(render1).toBe("6");
    expect(render2).toBe("24");
    expect(render3).toBe("28");
    expect(render4).toBe("30");
    expect(total).toBe("464");
  });

  it("remove first item", async () => {
    const removeButtons = screen.getAllByRole("button", { name: "remove" });
    const removeButton = removeButtons[0];

    await user.click(removeButton);
    await delay(100);

    let hslBoxes: any = document.querySelectorAll("span>div");

    let render1 = hslBoxes[0].dataset.render;
    let render2 = hslBoxes[1].dataset.render;
    let render3 = hslBoxes[2].dataset.render;
    let total = hslBoxes[2].parentElement.parentElement.children[0].textContent;

    expect(render1).toBe("24");
    expect(render2).toBe("28");
    expect(render3).toBe("31");
    expect(total).toBe("462");
  });

  it("remove second item", async () => {
    const removeButtons = screen.getAllByRole("button", { name: "remove" });
    const removeButton = removeButtons[1];

    await user.click(removeButton);
    await delay(100);

    let hslBoxes: any = document.querySelectorAll("span>div");

    let render1 = hslBoxes[0].dataset.render;
    let render2 = hslBoxes[1].dataset.render;
    let total = hslBoxes[1].parentElement.parentElement.children[0].textContent;

    expect(render1).toBe("24");
    expect(render2).toBe("32");
    expect(total).toBe("231");
  });

  it("remove final item", async () => {
    const removeButtons = screen.getAllByRole("button", { name: "remove" });
    const removeButton = removeButtons[0];

    await user.click(removeButton);
    await delay(100);

    let hslBoxes: any = document.querySelectorAll("span>div");

    let render1 = hslBoxes[0].dataset.render;
    let total = hslBoxes[0].parentElement.parentElement.children[0].textContent;

    expect(render1).toBe("33");
    expect(total).toBe("0");
  });
});

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
