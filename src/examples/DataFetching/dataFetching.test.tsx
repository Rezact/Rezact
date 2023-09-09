import { describe, expect, it } from "vitest";
import { screen, waitForElementToBeRemoved } from "@testing-library/dom";
import { render } from "rezact";

const testData = [
  { testData: "test1" },
  { testData: "test2" },
  { testData: "test3" },
];

let $isLoading = true;
let $error = null;
let $data = [];

function MockDataFetch() {
  return (
    <>
      <h1>Data Fetching</h1>

      {$isLoading && <p>Loading</p>}
      {$error && <p>Error</p>}

      {$data.map(($item) => (
        <p>{$item.testData}</p>
      ))}
    </>
  );
}

describe("Data Fetching suite", () => {
  it("renders loading state while 'fetching'", () => {
    render(document.body, MockDataFetch);
    const allHeaders = screen.getAllByText(/Data Fetching/i);
    expect(allHeaders).toHaveLength(1);

    const isLoading = screen.getByText("Loading");
    expect(isLoading).not.toBeNull();

    expect(document.body.innerHTML).toMatchSnapshot();
  });

  it("shows data once loaded", async () => {
    const isLoading = screen.getByText("Loading");
    setTimeout(() => {
      $isLoading = false;
      $data = testData;
    }, 20);
    await waitForElementToBeRemoved(isLoading);
    await screen.findByText("test3");
    expect(document.body.innerHTML).toMatchSnapshot();
  });

  it("shows error state when fetch failed", async () => {
    const test1 = screen.getByText("test1");
    setTimeout(() => {
      $data = [];
      $error = true;
    }, 20);
    await waitForElementToBeRemoved(test1);
    const error = screen.getByText("Error");
    expect(error).not.toBeNull();
    expect(document.body.innerHTML).toMatchSnapshot();
  });
});
