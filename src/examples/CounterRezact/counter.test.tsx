import { describe, expect, it } from "vitest";
import {
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/dom";
import { render } from "rezact";
import { Page } from "./Counter";

describe("counter suite name", () => {
  it("Counter", async () => {
    render(document.body, Page);
    const allHeaders = screen.getAllByText(/hello world/i);
    expect(allHeaders).toHaveLength(1);
    let button = await screen.findByRole("button");

    button.click();
    await waitFor(() => expect(button.textContent).toBe("Clicked 1 time"));

    button.click();
    await waitFor(() => expect(button.textContent).toBe("Clicked 2 times"));

    button.click();
    await waitFor(() => expect(button.textContent).toBe("Clicked 3 times"));
  });

  it("Calls the mount and unmount functions", async () => {
    let $mountCalled = null;
    let $unmountCalled = null;

    let mountCalledStateRef: any = $mountCalled;
    let unmountCalledStateRef: any = $unmountCalled;

    const onMount = () => ($mountCalled = true);
    const onUnmount = () => ($unmountCalled = true);

    const testElm = (
      <h1 onUnmount={onUnmount} onMount={onMount}>
        Mount Unmount Test
      </h1>
    );

    expect(mountCalledStateRef.getValue()).toBe(null);
    expect(unmountCalledStateRef.getValue()).toBe(null);

    render(document.body, () => testElm);

    const elmOnScreen = screen.getByText(/Mount Unmount Test/i);

    await waitFor(() => expect(mountCalledStateRef.getValue()).toBe(true));
    await waitFor(() => expect(unmountCalledStateRef.getValue()).toBe(null));

    setTimeout(() => testElm.remove(), 20);

    await waitForElementToBeRemoved(elmOnScreen);

    await waitFor(() => expect(mountCalledStateRef.getValue()).toBe(true));
    await waitFor(() => expect(unmountCalledStateRef.getValue()).toBe(true));
  });
});
