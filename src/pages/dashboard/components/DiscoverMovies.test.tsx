import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { MediaType, StorageKey } from "@/const";
import { useDiscoverMovies } from "@/hooks";

import { DiscoverMovies } from "./DiscoverMovies";

vi.mock("@/hooks", () => ({
  useDiscoverMovies: vi.fn(),
}));

vi.mock("react-router-dom", () => ({
  useLocation: () => ({ key: "test-key" }),
}));

vi.mock("@/components", () => ({
  MediaList: vi.fn(({ medias }) => (
    <div data-testid="media-list">
      {medias.map((m: { id: string }) => (
        <div
          key={m.id}
          data-testid="media-item"
          data-media={JSON.stringify(m)}
        />
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

const defaultQuery = { primaryReleaseYear: 2024 };

describe("DiscoverMovies", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    vi.mocked(useDiscoverMovies).mockReturnValue(defaultQueryResult as never);
  });

  it("passes empty array to MediaList when data is undefined", () => {
    const { getByTestId } = render(
      <DiscoverMovies query={defaultQuery} onReady={vi.fn()} />,
    );
    expect(getByTestId("media-list")).toBeInTheDocument();
  });

  it("flattens pages and adds type MOVIE to each item", () => {
    vi.mocked(useDiscoverMovies).mockReturnValue({
      ...defaultQueryResult,
      data: {
        pages: [
          {
            results: [
              { id: "1", title: "Movie 1" },
              { id: "2", title: "Movie 2" },
            ],
          },
          { results: [{ id: "3", title: "Movie 3" }] },
        ],
      },
    } as never);

    const { getAllByTestId } = render(
      <DiscoverMovies query={defaultQuery} onReady={vi.fn()} />,
    );
    const items = getAllByTestId("media-item");

    expect(items).toHaveLength(3);

    items.forEach((item) => {
      const media = JSON.parse(item.getAttribute("data-media")!);
      expect(media.type).toBe(MediaType.MOVIE);
    });
  });

  it("passes correct props to MediaList", async () => {
    const { MediaList } = await import("@/components");
    const fetchNextPage = vi.fn();
    const refetch = vi.fn();

    vi.mocked(useDiscoverMovies).mockReturnValue({
      ...defaultQueryResult,
      isLoading: true,
      fetchNextPage,
      refetch,
    } as never);

    render(<DiscoverMovies query={defaultQuery} onReady={vi.fn()} />);

    expect(vi.mocked(MediaList).mock.calls[0][0]).toEqual(
      expect.objectContaining({
        isLoading: true,
        fetchNextPage,
        refetch,
        storageKey: `${StorageKey.DISCOVER_MOVIES}_${defaultQuery.primaryReleaseYear}`,
      }),
    );
  });

  it("calls onReady with primaryReleaseYear when loading is done", () => {
    const onReady = vi.fn();

    vi.mocked(useDiscoverMovies).mockReturnValue({
      ...defaultQueryResult,
      isLoading: false,
    } as never);

    render(<DiscoverMovies query={defaultQuery} onReady={onReady} />);

    expect(onReady).toHaveBeenCalledWith(defaultQuery.primaryReleaseYear);
  });

  it("does not call onReady while loading", () => {
    const onReady = vi.fn();

    vi.mocked(useDiscoverMovies).mockReturnValue({
      ...defaultQueryResult,
      isLoading: true,
    } as never);

    render(<DiscoverMovies query={defaultQuery} onReady={onReady} />);

    expect(onReady).not.toHaveBeenCalled();
  });
});
