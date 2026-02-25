import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { MediaList } from "@/components";
import { useMediaItems } from "@/hooks";

import { MediasFromList } from "./MediasFromList";

vi.mock("react-router-dom", () => ({
  useParams: () => ({ id: "list-123" }),
}));

vi.mock("@/hooks", () => ({
  useMediaItems: vi.fn(),
}));

vi.mock("@/components", () => ({
  MediaList: vi.fn(({ medias }) => (
    <div data-testid="media-list">
      {medias.map((m: { id: string }) => (
        <div key={m.id} data-testid="media-item" />
      ))}
    </div>
  )),
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
  });

  it("calls useMediaItems with correct id", () => {
    render(<MediasFromList />);
    expect(useMediaItems).toHaveBeenCalledWith("list-123");
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
});
