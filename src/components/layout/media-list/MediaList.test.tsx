import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { MediaList } from "./MediaList";

vi.mock("swiper/css", () => ({}));

vi.mock("swiper/react", () => ({
  Swiper: ({
    children,
    onReachEnd,
  }: {
    children: React.ReactNode;
    onReachEnd: () => void;
  }) => (
    <div data-testid="swiper">
      {children}
      <button data-testid="reach-end" onClick={onReachEnd}>
        Reach End
      </button>
    </div>
  ),
  SwiperSlide: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock("swiper/modules", () => ({
  Navigation: {},
}));

vi.mock("@/components", () => ({
  EmptyState: ({ title }: { title: string }) => (
    <div data-testid="empty-state">{title}</div>
  ),
  ErrorState: ({ onRetry }: { onRetry: () => void }) => (
    <div data-testid="error-state">
      <button onClick={onRetry}>Retry</button>
    </div>
  ),
  Loading: () => <div data-testid="loading" />,
}));

vi.mock("../media-card/MediaCard", () => ({
  MediaCard: ({ media }: { media: { id: string; title: string } }) => (
    <div data-testid="media-card">{media.title}</div>
  ),
}));

const makeMedia = (id: string) => ({ id, title: `Movie ${id}` });

const defaultProps = {
  medias: [],
  isLoading: false,
  isError: false,
  error: null,
  fetchNextPage: vi.fn(),
  hasNextPage: false,
  isFetchingNextPage: false,
  refetch: vi.fn(),
};

describe("MediaList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows EmptyState when no medias and not loading", () => {
    render(<MediaList {...defaultProps} />);
    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
  });

  it("shows ErrorState when isError is true", () => {
    render(
      <MediaList
        {...defaultProps}
        isError={true}
        error={new Error("Failed")}
      />,
    );
    expect(screen.getByTestId("error-state")).toBeInTheDocument();
  });

  it("calls refetch when retry is clicked", () => {
    const refetch = vi.fn();
    render(
      <MediaList
        {...defaultProps}
        isError={true}
        error={new Error("Failed")}
        refetch={refetch}
      />,
    );
    fireEvent.click(screen.getByText("Retry"));
    expect(refetch).toHaveBeenCalled();
  });

  it("shows Loading when isLoading is true", () => {
    render(<MediaList {...defaultProps} isLoading={true} />);
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("renders media cards", () => {
    const medias = [makeMedia("1"), makeMedia("2"), makeMedia("3")];
    render(<MediaList {...defaultProps} medias={medias as never} />);
    expect(screen.getAllByTestId("media-card")).toHaveLength(3);
  });

  it("shows loading spinner when isFetchingNextPage is true", () => {
    const medias = [makeMedia("1")];
    render(
      <MediaList
        {...defaultProps}
        medias={medias as never}
        isFetchingNextPage={true}
      />,
    );
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("calls fetchNextPage when reaching end and hasNextPage is true", () => {
    const fetchNextPage = vi.fn();
    const medias = [makeMedia("1")];
    render(
      <MediaList
        {...defaultProps}
        medias={medias as never}
        hasNextPage={true}
        fetchNextPage={fetchNextPage}
      />,
    );
    fireEvent.click(screen.getByTestId("reach-end"));
    expect(fetchNextPage).toHaveBeenCalled();
  });

  it("does not call fetchNextPage when isFetchingNextPage is true", () => {
    const fetchNextPage = vi.fn();
    const medias = [makeMedia("1")];
    render(
      <MediaList
        {...defaultProps}
        medias={medias as never}
        hasNextPage={true}
        isFetchingNextPage={true}
        fetchNextPage={fetchNextPage}
      />,
    );
    fireEvent.click(screen.getByTestId("reach-end"));
    expect(fetchNextPage).not.toHaveBeenCalled();
  });

  it("does not call fetchNextPage when hasNextPage is false", () => {
    const fetchNextPage = vi.fn();
    const medias = [makeMedia("1")];
    render(
      <MediaList
        {...defaultProps}
        medias={medias as never}
        hasNextPage={false}
        fetchNextPage={fetchNextPage}
      />,
    );
    fireEvent.click(screen.getByTestId("reach-end"));
    expect(fetchNextPage).not.toHaveBeenCalled();
  });
});
