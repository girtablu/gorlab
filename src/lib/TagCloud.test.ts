import { render, screen, fireEvent } from "@testing-library/svelte";
import TagCloud from "./TagCloud.svelte";

const categories = ["systems", "supplements", "adventures"];

test("renders nothing when show is false", () => {
  render(TagCloud, { categories, selected: "all", show: false });
  expect(screen.queryByRole("group")).not.toBeInTheDocument();
});

test("renders nothing when categories is empty", () => {
  render(TagCloud, { categories: [], selected: "all", show: true });
  expect(screen.queryByText("All")).not.toBeInTheDocument();
});

test("renders All chip and one chip per category", () => {
  render(TagCloud, { categories, selected: "all", show: true });
  expect(screen.getByText("All")).toBeInTheDocument();
  for (const cat of categories) {
    expect(screen.getByText(cat)).toBeInTheDocument();
  }
});

test('All chip has filled preset when selected is "all"', () => {
  render(TagCloud, { categories, selected: "all", show: true });
  expect(screen.getByText("All")).toHaveClass("preset-filled");
});

test("category chip has filled preset when it matches selected", () => {
  render(TagCloud, { categories, selected: "systems", show: true });
  expect(screen.getByText("systems")).toHaveClass("preset-filled");
  expect(screen.getByText("All")).not.toHaveClass("preset-filled");
});

test("clicking a category chip fires selection change", async () => {
  const { component } = render(TagCloud, {
    categories,
    selected: "all",
    show: true,
  });
  await fireEvent.click(screen.getByText("systems"));
  // @testing-library/svelte exposes component for bindable prop inspection
  // The chip click sets selected internally — re-render should reflect new class
  expect(screen.getByText("systems")).toHaveClass("preset-filled");
});
