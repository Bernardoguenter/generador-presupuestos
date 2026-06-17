import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { MemoryRouter, useLocation } from "react-router";
import { describe, expect, it } from "vitest";
import { usePaginatedData } from "../usePaginatedData";
import { useSearchableTable } from "../useSearchableTable";

const renderWithRouter = (ui: ReactNode, initialEntry: string) =>
  render(<MemoryRouter initialEntries={[initialEntry]}>{ui}</MemoryRouter>);

function PaginationProbe() {
  const location = useLocation();
  const { currentPage, pageSize, setCurrentPage, setPageSize } =
    usePaginatedData([1, 2, 3, 4, 5, 6], 10, 30);

  return (
    <>
      <span data-testid="page">{currentPage}</span>
      <span data-testid="size">{pageSize}</span>
      <span data-testid="search">{location.search}</span>
      <button onClick={() => setCurrentPage(3)}>page 3</button>
      <button onClick={() => setCurrentPage(Number.NaN)}>invalid page</button>
      <button onClick={() => setPageSize(20)}>size 20</button>
      <button onClick={() => setPageSize(0)}>invalid size</button>
    </>
  );
}

function SearchProbe() {
  const location = useLocation();
  const { searchInput, setSearchInput } = useSearchableTable({
    data: [{ name: "Juan" }],
    filterFn: () => true,
  });

  return (
    <>
      <span data-testid="input">{searchInput}</span>
      <span data-testid="search">{location.search}</span>
      <button onClick={() => setSearchInput("maria")}>search maria</button>
      <button onClick={() => setSearchInput("")}>clear search</button>
    </>
  );
}

describe("URL table state hooks", () => {
  it("reads page and size from the URL", () => {
    renderWithRouter(<PaginationProbe />, "/budgets/structures?size=5&page=2");

    expect(screen.getByTestId("page")).toHaveTextContent("2");
    expect(screen.getByTestId("size")).toHaveTextContent("5");
  });

  it("normalizes invalid pagination params to defaults", () => {
    renderWithRouter(
      <PaginationProbe />,
      "/budgets/structures?size=0&page=-2",
    );

    expect(screen.getByTestId("page")).toHaveTextContent("1");
    expect(screen.getByTestId("size")).toHaveTextContent("10");
  });

  it("updates pagination with new URLSearchParams and preserves search", async () => {
    const user = userEvent.setup();
    renderWithRouter(
      <PaginationProbe />,
      "/budgets/structures?size=5&page=2&search=juan",
    );

    await user.click(screen.getByRole("button", { name: "page 3" }));

    expect(screen.getByTestId("search")).toHaveTextContent(
      "?size=5&page=3&search=juan",
    );

    await user.click(screen.getByRole("button", { name: "size 20" }));

    expect(screen.getByTestId("search")).toHaveTextContent(
      "?size=20&page=1&search=juan",
    );
  });

  it("normalizes invalid setter values", () => {
    renderWithRouter(
      <PaginationProbe />,
      "/budgets/structures?size=5&page=2&search=juan",
    );

    act(() => {
      screen.getByRole("button", { name: "invalid page" }).click();
    });

    expect(screen.getByTestId("search")).toHaveTextContent(
      "?size=5&page=1&search=juan",
    );

    act(() => {
      screen.getByRole("button", { name: "invalid size" }).click();
    });

    expect(screen.getByTestId("search")).toHaveTextContent(
      "?size=10&page=1&search=juan",
    );
  });

  it("reads, updates, and clears search while preserving size", async () => {
    const user = userEvent.setup();
    renderWithRouter(
      <SearchProbe />,
      "/budgets/structures?page=4&size=5&search=juan",
    );

    expect(screen.getByTestId("input")).toHaveTextContent("juan");

    await user.click(screen.getByRole("button", { name: "search maria" }));

    expect(screen.getByTestId("search")).toHaveTextContent(
      "?page=1&size=5&search=maria",
    );

    await user.click(screen.getByRole("button", { name: "clear search" }));

    expect(screen.getByTestId("search")).toHaveTextContent("?page=1&size=5");
  });
});
