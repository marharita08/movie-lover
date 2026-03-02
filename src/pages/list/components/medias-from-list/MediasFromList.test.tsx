import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { MediaList } from "@/components";
import { useDebounce, useMediaItems } from "@/hooks";

import { MediasFromList } from "./MediasFromList";

vi.mock("react-router-dom", () => ({
  useParams: () => ({ id: "list-123" }),
}));

vi.mock("@/hooks", () => ({
  useMediaItems: vi.fn(),
  useDebounce: vi.fn((value) => value),
}));

vi.mock("@/components", () => ({
  MediaList: vi.fn(({ medias }) => (
    <div data-testid="media-list">
      {medias.map((m: { id: string }) => (
        <div key={m.id} data-testid="media-item" />
      ))}
    </div>
  )),
  Input: ({
    placeholder,
    value,
    onChange,
  }: {
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }) => (
    <input
      data-testid="search-input"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  ),
}));

const defaultQueryResult = {
  data: undefined,
  isLoading: false,
  isError: false,
  error: null,
  fetchNextPage: vi.fn(),
  hasNextPage: false,
  isFetchingNextPage: false,
  refetch: vi.fn(),
};

describe("MediasFromList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useMediaItems).mockReturnValue(defaultQueryResult as never);
    vi.mocked(useDebounce).mockImplementation((value) => value);
  });

  it("calls useMediaItems with correct id and empty search", () => {
    render(<MediasFromList />);
    expect(useMediaItems).toHaveBeenCalledWith("list-123", { search: "" });
  });

  it("renders search input", () => {
    render(<MediasFromList />);
    expect(screen.getByTestId("search-input")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
  });

  it("updates search value on input change", () => {
    render(<MediasFromList />);
    const searchInput = screen.getByTestId("search-input");
    fireEvent.change(searchInput, { target: { value: "Inception" } });
    expect(searchInput).toHaveValue("Inception");
  });

  it("calls useMediaItems with debounced search value", () => {
    vi.mocked(useDebounce).mockReturnValue("Inception");
    render(<MediasFromList />);

    expect(useMediaItems).toHaveBeenCalledWith("list-123", {
      search: "Inception",
    });
  });

  it("passes search parameter through useDebounce", () => {
    render(<MediasFromList />);
    const searchInput = screen.getByTestId("search-input");

    fireEvent.change(searchInput, { target: { value: "Matrix" } });

    expect(useDebounce).toHaveBeenCalledWith("Matrix");
  });

  it("passes empty array to MediaList when data is undefined", () => {
    render(<MediasFromList />);
    expect(screen.getByTestId("media-list")).toBeInTheDocument();
    expect(screen.queryAllByTestId("media-item")).toHaveLength(0);
  });

  it("flattens pages and passes items to MediaList", () => {
    vi.mocked(useMediaItems).mockReturnValue({
      ...defaultQueryResult,
      data: {
        pages: [
          { results: [{ id: "1" }, { id: "2" }] },
          { results: [{ id: "3" }] },
        ],
      },
    } as never);

    render(<MediasFromList />);
    expect(screen.getAllByTestId("media-item")).toHaveLength(3);
  });

  it("passes correct props to MediaList", () => {
    const fetchNextPage = vi.fn();
    const refetch = vi.fn();

    vi.mocked(useMediaItems).mockReturnValue({
      ...defaultQueryResult,
      isLoading: true,
      fetchNextPage,
      refetch,
    } as never);

    render(<MediasFromList />);

    expect(vi.mocked(MediaList).mock.calls[0][0]).toEqual(
      expect.objectContaining({
        isLoading: true,
        fetchNextPage,
        refetch,
      }),
    );
  });

  it("clears search when input is cleared", () => {
    render(<MediasFromList />);
    const searchInput = screen.getByTestId("search-input");

    fireEvent.change(searchInput, { target: { value: "Interstellar" } });
    expect(searchInput).toHaveValue("Interstellar");

    fireEvent.change(searchInput, { target: { value: "" } });
    expect(searchInput).toHaveValue("");
  });

  it("filters results based on search query", () => {
    vi.mocked(useDebounce).mockReturnValue("Nolan");
    vi.mocked(useMediaItems).mockReturnValue({
      ...defaultQueryResult,
      data: {
        pages: [{ results: [{ id: "1", title: "Inception" }] }],
      },
    } as never);

    render(<MediasFromList />);

    expect(useMediaItems).toHaveBeenCalledWith("list-123", {
      search: "Nolan",
    });
    expect(screen.getAllByTestId("media-item")).toHaveLength(1);
  });
});
