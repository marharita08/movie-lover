import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useMultiSearch, useSearch } from "@/hooks";

import { Search } from "./Search";

vi.mock("@/hooks", () => ({
  useMultiSearch: vi.fn(),
  useSearch: vi.fn(),
}));

vi.mock("react-intersection-observer", () => ({
  useInView: vi.fn(() => ({ ref: vi.fn(), inView: false })),
}));

vi.mock("@/components", async () => {
  const React = await import("react");
  return {
    Input: React.forwardRef<
      HTMLInputElement,
      React.InputHTMLAttributes<HTMLInputElement> & {
        startIcon?: React.ReactNode;
      }
    >(({ startIcon: _startIcon, ...props }, ref) => (
      <input ref={ref} {...props} />
    )),
    Loading: () => <div data-testid="loading" />,
    ErrorState: ({ onRetry }: { onRetry: () => void }) => (
      <div data-testid="error-state">
        <button onClick={onRetry}>Retry</button>
      </div>
    ),
    EmptyState: ({
      title,
      description,
    }: {
      title: string;
      description: string;
    }) => (
      <div data-testid="empty-state">
        <div>{title}</div>
        <div>{description}</div>
      </div>
    ),
  };
});

vi.mock("./components/SearchResultCard", () => ({
  SearchResultCard: ({
    result,
  }: {
    result: { id: number; title?: string; name?: string };
  }) => (
    <div data-testid="search-result-card">{result.title || result.name}</div>
  ),
}));

const defaultQueryResult = {
  data: undefined,
  fetchNextPage: vi.fn(),
  hasNextPage: false,
  isFetchingNextPage: false,
  isLoading: false,
  isError: false,
  error: null,
  refetch: vi.fn(),
};

const defaultSearchResult = {
  search: "",
  setSearch: vi.fn(),
  debouncedSearch: "",
};

describe("Search", () => {
  const setSearchMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useMultiSearch).mockReturnValue(defaultQueryResult as never);
    vi.mocked(useSearch).mockReturnValue({
      ...defaultSearchResult,
      setSearch: setSearchMock,
    });
  });

  it("renders search input and heading", () => {
    render(<Search />);

    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Search" })).toBeInTheDocument();
  });

  it("shows Loading when isLoading is true", () => {
    vi.mocked(useMultiSearch).mockReturnValue({
      ...defaultQueryResult,
      isLoading: true,
    } as never);

    render(<Search />);

    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("shows Loading when isFetchingNextPage is true", () => {
    vi.mocked(useMultiSearch).mockReturnValue({
      ...defaultQueryResult,
      data: {
        pages: [
          {
            results: [{ id: 1, title: "Inception", mediaType: "movie" }],
          },
        ],
      },
      isFetchingNextPage: true,
    } as never);

    render(<Search />);

    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("shows ErrorState when isError is true", () => {
    vi.mocked(useMultiSearch).mockReturnValue({
      ...defaultQueryResult,
      isError: true,
      error: new Error("Failed"),
    } as never);

    render(<Search />);

    expect(screen.getByTestId("error-state")).toBeInTheDocument();
  });

  it("calls refetch on retry click", () => {
    const refetch = vi.fn();
    vi.mocked(useMultiSearch).mockReturnValue({
      ...defaultQueryResult,
      isError: true,
      error: new Error("Failed"),
      refetch,
    } as never);

    render(<Search />);

    fireEvent.click(screen.getByText("Retry"));

    expect(refetch).toHaveBeenCalled();
  });

  it("shows EmptyState with default text when no query", () => {
    vi.mocked(useMultiSearch).mockReturnValue({
      ...defaultQueryResult,
      data: { pages: [{ results: [] }] },
    } as never);

    render(<Search />);

    expect(
      screen.getByText("Search for movies, TV shows, or people"),
    ).toBeInTheDocument();
    expect(screen.getByText("Start typing to search...")).toBeInTheDocument();
  });

  it("shows EmptyState with search text when query is active", () => {
    vi.mocked(useSearch).mockReturnValue({
      search: "inception",
      setSearch: setSearchMock,
      debouncedSearch: "inception",
    });
    vi.mocked(useMultiSearch).mockReturnValue({
      ...defaultQueryResult,
      data: { pages: [{ results: [] }] },
    } as never);

    render(<Search />);

    expect(screen.getByText("No matching results found")).toBeInTheDocument();
    expect(screen.getByText(/inception/)).toBeInTheDocument();
  });

  it("renders search result cards", () => {
    vi.mocked(useMultiSearch).mockReturnValue({
      ...defaultQueryResult,
      data: {
        pages: [
          {
            results: [
              { id: 1, title: "Inception", mediaType: "movie" },
              { id: 2, name: "Breaking Bad", mediaType: "tv" },
            ],
          },
        ],
      },
    } as never);

    render(<Search />);

    expect(screen.getAllByTestId("search-result-card")).toHaveLength(2);
    expect(screen.getByText("Inception")).toBeInTheDocument();
    expect(screen.getByText("Breaking Bad")).toBeInTheDocument();
  });

  it("flattens pages into single list", () => {
    vi.mocked(useMultiSearch).mockReturnValue({
      ...defaultQueryResult,
      data: {
        pages: [
          { results: [{ id: 1, title: "Movie 1", mediaType: "movie" }] },
          { results: [{ id: 2, name: "Show 2", mediaType: "tv" }] },
        ],
      },
    } as never);

    render(<Search />);

    expect(screen.getAllByTestId("search-result-card")).toHaveLength(2);
  });

  it("calls fetchNextPage when inView and hasNextPage", async () => {
    const fetchNextPage = vi.fn();
    const { useInView } = await import("react-intersection-observer");
    vi.mocked(useInView).mockReturnValue({
      ref: vi.fn(),
      inView: true,
    } as never);
    vi.mocked(useMultiSearch).mockReturnValue({
      ...defaultQueryResult,
      data: {
        pages: [{ results: [{ id: 1, title: "Movie 1", mediaType: "movie" }] }],
      },
      hasNextPage: true,
      fetchNextPage,
    } as never);

    render(<Search />);

    await waitFor(() => {
      expect(fetchNextPage).toHaveBeenCalled();
    });
  });

  it("does not call fetchNextPage when isFetchingNextPage is true", async () => {
    const fetchNextPage = vi.fn();
    const { useInView } = await import("react-intersection-observer");
    vi.mocked(useInView).mockReturnValue({
      ref: vi.fn(),
      inView: true,
    } as never);
    vi.mocked(useMultiSearch).mockReturnValue({
      ...defaultQueryResult,
      data: {
        pages: [{ results: [{ id: 1, title: "Movie 1", mediaType: "movie" }] }],
      },
      hasNextPage: true,
      isFetchingNextPage: true,
      fetchNextPage,
    } as never);

    render(<Search />);

    expect(fetchNextPage).not.toHaveBeenCalled();
  });

  it("updates input value when typing", () => {
    render(<Search />);

    const input = screen.getByPlaceholderText("Search...");
    fireEvent.change(input, { target: { value: "inception" } });

    expect(setSearchMock).toHaveBeenCalledWith("inception");
  });

  it("respects maxLength on input", () => {
    render(<Search />);

    const input = screen.getByPlaceholderText("Search...");
    expect(input).toHaveAttribute("maxLength", "255");
  });

  it("passes debounced search to useMultiSearch", () => {
    vi.mocked(useSearch).mockReturnValue({
      search: "batman",
      setSearch: setSearchMock,
      debouncedSearch: "batman",
    });

    render(<Search />);

    expect(useMultiSearch).toHaveBeenCalledWith({ query: "batman" });
  });
});
