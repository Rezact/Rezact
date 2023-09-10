import { describe, expect, it } from "vitest";
import { screen, waitFor } from "@testing-library/dom";
import { render } from "rezact";
import { Page as UncontrolledForm } from "./UncontrolledForms";
import { Page as ControlledForm } from "./ControlledForms";
import userEvent from "@testing-library/user-event";

const user = userEvent.setup();

describe("Uncontrolled Forms suite", () => {
  it("renders a form", () => {
    document.body.innerHTML = "";
    render(document.body, UncontrolledForm);
    const form = document.getElementById("test-form");
    expect(form).not.toBeNull();
    expect(screen.getByText(/Uncontrolled Forms and Controls/i)).not.toBeNull();
    const textArea = document.querySelector("textarea");
    expect(textArea).not.toBeNull();

    // expect snapshot to match
    expect(document.body).toMatchSnapshot();
    expect(textArea.value).toMatchSnapshot();
  });

  it("updates the text area when the form changes", async () => {
    const firstName = screen.getByLabelText(/First Name/i) as HTMLInputElement;
    const lastName = screen.getByLabelText(/Last Name/i) as HTMLInputElement;
    const age = screen.getByLabelText(/age/i) as HTMLInputElement;
    const child1 = screen.getByLabelText(/Child 1/i) as HTMLInputElement;
    const child2 = screen.getByLabelText(/Child 2/i) as HTMLInputElement;
    const child3 = screen.getByLabelText(/Child 3/i) as HTMLInputElement;
    const scales = screen.getByLabelText(/Scales/i) as HTMLInputElement;
    const horns = screen.getByLabelText(/Horns/i) as HTMLInputElement;
    const huey = screen.getByLabelText(/Huey/i) as HTMLInputElement;
    const dewey = screen.getByLabelText(/Dewey/i) as HTMLInputElement;
    const louie = screen.getByLabelText(/Louie/i) as HTMLInputElement;
    const item1 = document.querySelector(
      '[name="lineItems[0].item"]'
    ) as HTMLInputElement;
    const price1 = document.querySelector(
      '[name="lineItems[0].price"]'
    ) as HTMLInputElement;
    const item2 = document.querySelector(
      '[name="lineItems[1].item"]'
    ) as HTMLInputElement;
    const price2 = document.querySelector(
      '[name="lineItems[1].price"]'
    ) as HTMLInputElement;
    const item3 = document.querySelector(
      '[name="lineItems[2].item"]'
    ) as HTMLInputElement;
    const price3 = document.querySelector(
      '[name="lineItems[2].price"]'
    ) as HTMLInputElement;

    // get select element
    const selectElement = document.querySelector("select");

    const textArea = document.querySelector("textarea");

    expect(firstName).not.toBeNull();
    expect(lastName).not.toBeNull();
    expect(age).not.toBeNull();
    expect(child1).not.toBeNull();
    expect(child2).not.toBeNull();
    expect(child3).not.toBeNull();
    expect(scales).not.toBeNull();
    expect(horns).not.toBeNull();
    expect(huey).not.toBeNull();
    expect(dewey).not.toBeNull();
    expect(louie).not.toBeNull();
    expect(item1).not.toBeNull();
    expect(price1).not.toBeNull();
    expect(item2).not.toBeNull();
    expect(price2).not.toBeNull();
    expect(item3).not.toBeNull();
    expect(price3).not.toBeNull();
    expect(selectElement).not.toBeNull();
    expect(textArea).not.toBeNull();

    const resetButton = screen.getByText(/Reset/i);
    await user.click(resetButton);

    await user.type(firstName, "Jane");
    await user.type(lastName, "Doe");
    await user.type(age, "40");
    await user.type(child1, "Sally");
    await user.type(child2, "Bob");
    await user.type(child3, "Joe");
    await user.click(scales);
    await user.click(horns);
    await user.click(louie);
    await user.type(item1, "Item 1");
    await user.type(price1, "14.00");
    await user.type(item2, "Item 2");
    await user.type(price2, "15.00");
    await user.type(item3, "Item 3");
    await user.type(price3, "16.00");

    selectElement.value = "Opt 2";
    await user.click(selectElement);

    await waitFor(() => expect(firstName.value).toBe("Jane"));
    await waitFor(() => expect(price3.value).toBe("16.00"));
    expect(textArea.value).toMatchSnapshot();
  });

  it("updates the form when the update button is clicked", async () => {
    const updateButton = screen.getByText(/Update Form Data/i);
    await user.click(updateButton);

    // get firstname and select elements
    const firstName = screen.getByLabelText(/First Name/i) as HTMLInputElement;
    const selectElement = document.querySelector("select");

    expect(firstName.value).toBe("dude");
    expect(selectElement.value).toBe("Opt 3");

    const textArea = document.querySelector("textarea");
    expect(textArea.value).toMatchSnapshot();
  });

  it("clears the form when the reset button is clicked", async () => {
    const resetButton = screen.getByText(/Reset/i);
    await user.click(resetButton);

    const firstName = screen.getByLabelText(/First Name/i) as HTMLInputElement;
    const selectElement = document.querySelector("select");

    expect(firstName.value).toBe("");
    expect(selectElement.value).toBe("");

    const textArea = document.querySelector("textarea");
    expect(textArea.value).toMatchSnapshot();
  });
});

describe("Controlled Forms suite", () => {
  it("renders a form", () => {
    document.body.innerHTML = "";
    render(document.body, ControlledForm);
    const form = document.getElementById("test-form");
    expect(form).not.toBeNull();
    expect(screen.getByText(/Controlled Forms and Controls/i)).not.toBeNull();
    const textArea = document.querySelector("textarea");
    expect(textArea).not.toBeNull();

    // expect snapshot to match
    expect(document.body).toMatchSnapshot();
    expect(textArea.value).toMatchSnapshot();
  });

  it("updates the text area when the form changes", async () => {
    const firstName = screen.getByLabelText(/First Name/i) as HTMLInputElement;
    const lastName = screen.getByLabelText(/Last Name/i) as HTMLInputElement;
    const age = screen.getByLabelText(/age/i) as HTMLInputElement;
    const child1 = screen.getByLabelText(/Child 1/i) as HTMLInputElement;
    const child2 = screen.getByLabelText(/Child 2/i) as HTMLInputElement;
    const child3 = screen.getByLabelText(/Child 3/i) as HTMLInputElement;
    const scales = screen.getByLabelText(/Scales/i) as HTMLInputElement;
    const horns = screen.getByLabelText(/Horns/i) as HTMLInputElement;
    const huey = screen.getByLabelText(/Huey/i) as HTMLInputElement;
    const dewey = screen.getByLabelText(/Dewey/i) as HTMLInputElement;
    const louie = screen.getByLabelText(/Louie/i) as HTMLInputElement;
    const items = document.querySelectorAll(".line-item");
    const item1 = items[0].querySelectorAll("input")[0] as HTMLInputElement;
    const price1 = items[0].querySelectorAll("input")[1] as HTMLInputElement;
    const item2 = items[1].querySelectorAll("input")[0] as HTMLInputElement;
    const price2 = items[1].querySelectorAll("input")[1] as HTMLInputElement;
    const item3 = items[2].querySelectorAll("input")[0] as HTMLInputElement;
    const price3 = items[2].querySelectorAll("input")[1] as HTMLInputElement;

    // get select element
    const selectElement = document.querySelector("select");

    const textArea = document.querySelector("textarea");

    expect(firstName).not.toBeNull();
    expect(lastName).not.toBeNull();
    expect(age).not.toBeNull();
    expect(child1).not.toBeNull();
    expect(child2).not.toBeNull();
    expect(child3).not.toBeNull();
    expect(scales).not.toBeNull();
    expect(horns).not.toBeNull();
    expect(huey).not.toBeNull();
    expect(dewey).not.toBeNull();
    expect(louie).not.toBeNull();
    expect(item1).not.toBeNull();
    expect(price1).not.toBeNull();
    expect(item2).not.toBeNull();
    expect(price2).not.toBeNull();
    expect(item3).not.toBeNull();
    expect(price3).not.toBeNull();
    expect(selectElement).not.toBeNull();
    expect(textArea).not.toBeNull();

    const resetButton = screen.getByText(/Reset/i);
    await user.click(resetButton);

    await waitFor(() => expect(firstName.value).toBe(""));
    await waitFor(() => expect(selectElement.value).toBe(""));

    await user.type(firstName, "Jane");
    await user.type(lastName, "Doe");
    await user.type(age, "40");
    await user.type(child1, "Sally");
    await user.type(child2, "Bob");
    await user.type(child3, "Joe");
    await user.click(scales);
    await user.click(horns);
    await user.click(louie);
    await user.type(item1, "Item 1");
    await user.type(price1, "14.00");
    await user.type(item2, "Item 2");
    await user.type(price2, "15.00");
    await user.type(item3, "Item 3");
    await user.type(price3, "16.00");

    selectElement.value = "Opt 2";
    await user.click(selectElement);

    await waitFor(() => expect(firstName.value).toBe("Jane"));
    await waitFor(() => expect(price3.value).toBe("3.00"));
    expect(textArea.value).toMatchSnapshot();
  });

  it("updates the form when the update button is clicked", async () => {
    const updateButton = screen.getByText(/Update Form Data/i);
    await user.click(updateButton);

    // get firstname and select elements
    const firstName = screen.getByLabelText(/First Name/i) as HTMLInputElement;
    const selectElement = document.querySelector("select");

    expect(firstName.value).toBe("Jane");
    expect(selectElement.value).toBe("Opt 4");

    const textArea = document.querySelector("textarea");
    expect(textArea.value).toMatchSnapshot();
  });

  it("clears the form when the reset button is clicked", async () => {
    const resetButton = screen.getByText(/Reset/i);
    await user.click(resetButton);

    const firstName = screen.getByLabelText(/First Name/i) as HTMLInputElement;
    const selectElement = document.querySelector("select");

    expect(firstName.value).toBe("");
    expect(selectElement.value).toBe("");

    const textArea = document.querySelector("textarea");
    expect(textArea.value).toMatchSnapshot();
  });
});
