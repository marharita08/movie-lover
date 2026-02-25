import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useGenreStats } from "@/hooks";

import { GenresAnalytics } from "./GenresAnalytics";

vi.mock("react-router-dom", () => ({
  useParams: () => ({ id: "list-123" }),
}));

vi.mock("@/hooks", () => ({
  useGenreStats: vi.fn(),
}));

vi.mock("@/components", () => ({
  Loading: () => <div data-testid="loading" />,
  ErrorState: ({ onRetry }: { onRetry: () => void }) => (
    <div data-testid="error-state">
      <button onClick={onRetry}>Retry</button>
    </div>
  ),
  EmptyState: ({ title }: { title: string }) => (
    <div data-testid="empty-state">{title}</div>
  ),
}));

vi.mock("./GenresBarChart", () => ({
  GenresBarChart: ({ data }: { data: { genre: string; amount: number }[] }) => (
    <div data-testid="genres-bar-chart" data-count={data.length} />
  ),
}));

describe("GenresAnalytics", () => {
  const refetch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows Loading when isLoading is true", () => {
    vi.mocked(useGenreStats).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
      refetch,
    } as never);
    render(<GenresAnalytics />);
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("shows ErrorState when isError is true", () => {
    vi.mocked(useGenreStats).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error("Failed"),
      refetch,
    } as never);
    render(<GenresAnalytics />);
    expect(screen.getByTestId("error-state")).toBeInTheDocument();
  });

  it("calls refetch on retry click", () => {
    vi.mocked(useGenreStats).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error("Failed"),
      refetch,
    } as never);
    render(<GenresAnalytics />);
    fireEvent.click(screen.getByText("Retry"));
    expect(refetch).toHaveBeenCalled();
  });

  it("shows EmptyState when genres are empty", () => {
    vi.mocked(useGenreStats).mockReturnValue({
      data: {},
      isLoading: false,
      isError: false,
      error: null,
      refetch,
    } as never);
    render(<GenresAnalytics />);
    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
  });

  it("shows GenresBarChart when genres are present", () => {
    vi.mocked(useGenreStats).mockReturnValue({
      data: { Action: 10, Drama: 5 },
      isLoading: false,
      isError: false,
      error: null,
      refetch,
    } as never);
    render(<GenresAnalytics />);
    expect(screen.getByTestId("genres-bar-chart")).toBeInTheDocument();
  });

  it("correctly transforms data object to array for GenresBarChart", () => {
    vi.mocked(useGenreStats).mockReturnValue({
      data: { Action: 10, Drama: 5 },
      isLoading: false,
      isError: false,
      error: null,
      refetch,
    } as never);
    render(<GenresAnalytics />);
    expect(screen.getByTestId("genres-bar-chart")).toHaveAttribute(
      "data-count",
      "2",
    );
  });
});
