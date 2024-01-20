import { describe, expect, it } from "vitest";
import { screen, waitFor } from "@testing-library/dom";
import { render } from "rezact";
import { Page } from "./Todo";
import userEvent from "@testing-library/user-event";
import { delay } from "src/lib/utils";

const user = userEvent.setup();

const testDiv = document.createElement("div");
document.body.appendChild(testDiv);

describe("Todo suite", () => {
  it("Renders Todo List", async () => {
    render(testDiv, Page);
    await delay(100);
    expect(screen.getByText("Todo List")).not.toBeNull();
    expect(testDiv.innerHTML).toMatchSnapshot();
  });

  it("Filters Todo List", async () => {
    const todos = document.querySelectorAll("div[style]");
    expect(todos.length).toBe(3);

    await user.click(screen.getByText("Show Completed"));
    await waitFor(() => {
      const todos = document.querySelectorAll("div[style]");
      expect(todos.length).toBe(1);
    });
    await delay(100);
    expect(testDiv.innerHTML).toMatchSnapshot();

    await user.click(screen.getByText("Show All"));
    await waitFor(() => {
      const todos = document.querySelectorAll("div[style]");
      expect(todos.length).toBe(3);
    });
    await delay(100);
    expect(testDiv.innerHTML).toMatchSnapshot();

    await user.click(screen.getByText("Show Todo"));
    await waitFor(() => {
      const todos = document.querySelectorAll("div[style]");
      expect(todos.length).toBe(2);
    });
    await delay(100);
    expect(testDiv.innerHTML).toMatchSnapshot();
  });

  it("Adds Todo", async () => {
    const newTodoInput = screen.getByPlaceholderText("Add Todo");
    const addButton = screen.getByRole("button", { name: "Add" });

    await user.type(newTodoInput, "New Todo");
    await user.click(addButton);

    await waitFor(() => {
      const todos = document.querySelectorAll("div[style]");
      expect(todos.length).toBe(3);
    });
    await delay(100);
    expect(testDiv.innerHTML).toMatchSnapshot();

    await user.type(newTodoInput, "Another Todo");
    await user.click(addButton);

    await waitFor(() => {
      const todos = document.querySelectorAll("div[style]");
      expect(todos.length).toBe(4);
    });
    await delay(100);
    expect(testDiv.innerHTML).toMatchSnapshot();

    await user.type(newTodoInput, "Doing it again");
    await user.click(addButton);

    await waitFor(() => {
      const todos = document.querySelectorAll("div[style]");
      expect(todos.length).toBe(5);
    });
    await delay(100);
    expect(testDiv.innerHTML).toMatchSnapshot();
  });

  it("Completes Todo", async () => {
    let todos = document.querySelectorAll("div[style]");
    expect(todos.length).toBe(5);

    const completeButton = todos[0].querySelector("input[type=checkbox]");
    await user.click(completeButton);
    await waitFor(() => {
      const test = document.querySelectorAll("div[style]");
      expect(test.length).toBe(4);
    });
    await delay(100);
    expect(testDiv.innerHTML).toMatchSnapshot();

    todos = document.querySelectorAll("div[style]");
    const completeButton2 = todos[2].querySelector("input[type=checkbox]");
    await user.click(completeButton2);
    await waitFor(() => {
      const test = document.querySelectorAll("div[style]");
      expect(test.length).toBe(3);
    });
    await delay(100);
    expect(testDiv.innerHTML).toMatchSnapshot();

    todos = document.querySelectorAll("div[style]");
    const completeButton3 = todos[2].querySelector("input[type=checkbox]");
    await user.click(completeButton3);
    await waitFor(() => {
      const test = document.querySelectorAll("div[style]");
      expect(test.length).toBe(2);
    });
    await delay(100);
    expect(testDiv.innerHTML).toMatchSnapshot();
  });

  it("Edits Todo", async () => {
    let todos = document.querySelectorAll("div[style]");
    expect(todos.length).toBe(2);
    let span = todos[0].querySelectorAll("span")[1];
    expect(span.innerText).toBe("1 - Build something awesome");

    let inputs = todos[0].querySelectorAll("input");
    await user.dblClick(span);
    await waitFor(() => {
      inputs = todos[0].querySelectorAll("input");
      expect(inputs.length).toBe(2);
    });

    await user.clear(inputs[0]);
    await user.type(inputs[0], "Edited");
    await user.keyboard("{Enter}");
    await waitFor(() => {
      span = todos[0].querySelectorAll("span")[1];
      expect(span.innerText).toBe("1 - Edited");
    });
    await delay(100);
    expect(testDiv.innerHTML).toMatchSnapshot();
  });

  it("Deletes Todo", async () => {
    let todos = document.querySelectorAll("div[style]");
    expect(todos.length).toBe(2);

    const deleteButton = todos[0].querySelector("button");
    await user.click(deleteButton);
    await waitFor(() => {
      const test = document.querySelectorAll("div[style]");
      expect(test.length).toBe(1);
    });
    await delay(100);
    expect(testDiv.innerHTML).toMatchSnapshot();

    todos = document.querySelectorAll("div[style]");
    const deleteButton2 = todos[0].querySelector("button");
    await user.click(deleteButton2);
    await waitFor(() => {
      const test = document.querySelectorAll("div[style]");
      expect(test.length).toBe(0);
    });
    await delay(100);
    expect(testDiv.innerHTML).toMatchSnapshot();
  });

  it("Completed Todos has more items", async () => {
    await user.click(screen.getByText("Show Completed"));
    await waitFor(() => {
      const todos = document.querySelectorAll("div[style]");
      expect(todos.length).toBe(4);
    });
    await delay(100);
    expect(testDiv.innerHTML).toMatchSnapshot();
  });

  it("Unchecks Completed Todo", async () => {
    let todos = document.querySelectorAll("div[style]");
    expect(todos.length).toBe(4);

    const completeButton = todos[0].querySelector("input[type=checkbox]");
    await user.click(completeButton);
    await waitFor(() => {
      const test = document.querySelectorAll("div[style]");
      expect(test.length).toBe(3);
    });
    await delay(100);
    expect(testDiv.innerHTML).toMatchSnapshot();

    todos = document.querySelectorAll("div[style]");
    const completeButton2 = todos[0].querySelector("input[type=checkbox]");
    await user.click(completeButton2);
    await waitFor(() => {
      const test = document.querySelectorAll("div[style]");
      expect(test.length).toBe(2);
    });
    await delay(100);
    expect(testDiv.innerHTML).toMatchSnapshot();
  });

  it("Show All has more items", async () => {
    await user.click(screen.getByText("Show All"));
    await waitFor(() => {
      const todos = document.querySelectorAll("div[style]");
      expect(todos.length).toBe(4);
    });
    await delay(100);
    expect(testDiv.innerHTML).toMatchSnapshot();
  });

  it("Clears Completed Todos", async () => {
    await user.click(screen.getByText("Remove Completed"));
    await waitFor(() => {
      const todos = document.querySelectorAll("div[style]");
      expect(todos.length).toBe(2);
    });
    await delay(100);
    expect(testDiv.innerHTML).toMatchSnapshot();
  });

  it("Checks All Todos", async () => {
    await user.click(screen.getByText("Check All"));
    await waitFor(() => {
      const todos = document.querySelectorAll("div[style]");
      const chk1 = todos[0].querySelector(
        "input[type=checkbox]"
      ) as HTMLInputElement;
      const chk2 = todos[1].querySelector(
        "input[type=checkbox]"
      ) as HTMLInputElement;
      expect(chk1.checked).toBe(true);
      expect(chk2.checked).toBe(true);
    });
    await delay(100);
    expect(testDiv.innerHTML).toMatchSnapshot();
  });

  it("Deletes Todo Items", async () => {
    let todos = document.querySelectorAll("div[style]");
    expect(todos.length).toBe(2);

    const deleteButton = todos[0].querySelector("button");
    await user.click(deleteButton);
    await waitFor(() => {
      const test = document.querySelectorAll("div[style]");
      expect(test.length).toBe(1);
    });
    await delay(100);
    expect(testDiv.innerHTML).toMatchSnapshot();

    todos = document.querySelectorAll("div[style]");
    const deleteButton2 = todos[0].querySelector("button");
    await user.click(deleteButton2);
    await waitFor(() => {
      const test = document.querySelectorAll("div[style]");
      expect(test.length).toBe(0);
    });
    await delay(100);
    expect(testDiv.innerHTML).toMatchSnapshot();
  });
});
