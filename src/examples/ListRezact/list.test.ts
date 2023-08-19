import { describe, expect, it } from "vitest";
import { screen, waitForElementToBeRemoved } from "@testing-library/dom";
import { render } from "src/lib/rezact/rezact";
import { Page } from "./List";

describe("List suite", () => {
  it("List Test", async () => {
    render(document.body, Page);
    const rootElm = document.querySelector("div");
    expect(rootElm.children).toHaveLength(2);
    expect(rootElm.children[0].children).toHaveLength(11);
    expect(rootElm.children[1].children).toHaveLength(11);

    expect(
      rootElm.children[0].children[1] instanceof HTMLParagraphElement
    ).toBe(true);

    expect(rootElm.children[0].children[2] instanceof HTMLStyleElement).toBe(
      true
    );

    const keyedTitle = screen.getAllByText("Keyed");
    expect(keyedTitle).toHaveLength(1);

    const unkeyedTitle = screen.getAllByText("Unkeyed");
    expect(unkeyedTitle).toHaveLength(1);

    let initSpans = screen.getAllByText("initial");
    expect(initSpans).toHaveLength(10);
    expect(initSpans[0].style.backgroundColor).toBe("darkblue");

    let spans = screen.getAllByText("current");
    expect(spans).toHaveLength(10);
    expect(spans[0].style.backgroundColor).toBe("darkblue");

    const button = screen.getByRole("button");
    button.click();
    await waitForElementToBeRemoved(initSpans[0]);
    expect(rootElm.children[0].children).toHaveLength(9);
    expect(rootElm.children[1].children).toHaveLength(9);
    expect(
      rootElm.children[0].children[1] instanceof HTMLParagraphElement
    ).toBe(true);

    expect(rootElm.children[0].children[2] instanceof HTMLStyleElement).toBe(
      true
    );

    initSpans = screen.getAllByText("initial");
    expect(initSpans).toHaveLength(8);
    expect(initSpans[0].style.backgroundColor).toBe("indigo");

    spans = screen.getAllByText("current");
    expect(spans).toHaveLength(8);
    expect(spans[0].style.backgroundColor).toBe("indigo");

    button.click();
    expect(rootElm.children[0].children).toHaveLength(7);
    expect(rootElm.children[1].children).toHaveLength(7);
    expect(
      rootElm.children[0].children[1] instanceof HTMLParagraphElement
    ).toBe(true);

    expect(rootElm.children[0].children[2] instanceof HTMLStyleElement).toBe(
      true
    );

    initSpans = screen.getAllByText("initial");
    expect(initSpans).toHaveLength(6);
    expect(initSpans[0].style.backgroundColor).toBe("deeppink");

    spans = screen.getAllByText("current");
    expect(spans).toHaveLength(6);
    expect(spans[0].style.backgroundColor).toBe("deeppink");

    button.click();
    expect(rootElm.children[0].children).toHaveLength(5);
    expect(rootElm.children[1].children).toHaveLength(5);
    expect(
      rootElm.children[0].children[1] instanceof HTMLParagraphElement
    ).toBe(true);

    expect(rootElm.children[0].children[2] instanceof HTMLStyleElement).toBe(
      true
    );

    initSpans = screen.getAllByText("initial");
    expect(initSpans).toHaveLength(4);
    expect(initSpans[0].style.backgroundColor).toBe("salmon");

    spans = screen.getAllByText("current");
    expect(spans).toHaveLength(4);
    expect(spans[0].style.backgroundColor).toBe("salmon");

    button.click();
    expect(rootElm.children[0].children).toHaveLength(3);
    expect(rootElm.children[1].children).toHaveLength(3);
    expect(
      rootElm.children[0].children[1] instanceof HTMLParagraphElement
    ).toBe(true);

    expect(rootElm.children[0].children[2] instanceof HTMLStyleElement).toBe(
      true
    );

    initSpans = screen.getAllByText("initial");
    expect(initSpans).toHaveLength(2);
    expect(initSpans[0].style.backgroundColor).toBe("gold");

    spans = screen.getAllByText("current");
    expect(spans).toHaveLength(2);
    expect(spans[0].style.backgroundColor).toBe("gold");

    button.click();

    initSpans = screen.queryAllByText("initial");
    expect(initSpans).toHaveLength(0);

    spans = screen.queryAllByText("current");
    expect(spans).toHaveLength(0);
  });
});
