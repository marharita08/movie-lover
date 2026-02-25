import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useMediaTypeStats } from "@/hooks";

import { MediaTypeAnalytics } from "./MediaTypeAnalytics";

vi.mock("react-router-dom", () => ({
  useParams: () => ({ id: "list-123" }),
}));

vi.mock("@/hooks", () => ({
  useMediaTypeStats: vi.fn(),
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

vi.mock("./MediaTypePieChart", () => ({
  MediaTypePieChart: ({
    data,
  }: {
    data: { name: string; value: number }[];
  }) => <div data-testid="media-type-pie-chart" data-count={data.length} />,
}));

describe("MediaTypeAnalytics", () => {
  const refetch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows Loading when isLoading is true", () => {
    vi.mocked(useMediaTypeStats).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
      refetch,
    } as never);
    render(<MediaTypeAnalytics />);
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("shows ErrorState when isError is true", () => {
    vi.mocked(useMediaTypeStats).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error("Failed"),
      refetch,
    } as never);
    render(<MediaTypeAnalytics />);
    expect(screen.getByTestId("error-state")).toBeInTheDocument();
  });

  it("calls refetch on retry click", () => {
    vi.mocked(useMediaTypeStats).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error("Failed"),
      refetch,
    } as never);
    render(<MediaTypeAnalytics />);
    fireEvent.click(screen.getByText("Retry"));
    expect(refetch).toHaveBeenCalled();
  });

  it("shows EmptyState when chart data is empty", () => {
    vi.mocked(useMediaTypeStats).mockReturnValue({
      data: {},
      isLoading: false,
      isError: false,
      error: null,
      refetch,
    } as never);
    render(<MediaTypeAnalytics />);
    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
  });

  it("shows MediaTypePieChart when data is present", () => {
    vi.mocked(useMediaTypeStats).mockReturnValue({
      data: { movie: 10, tv: 5 },
      isLoading: false,
      isError: false,
      error: null,
      refetch,
    } as never);
    render(<MediaTypeAnalytics />);
    expect(screen.getByTestId("media-type-pie-chart")).toBeInTheDocument();
  });

  it("correctly transforms data object to array for MediaTypePieChart", () => {
    vi.mocked(useMediaTypeStats).mockReturnValue({
      data: { movie: 10, tv: 5 },
      isLoading: false,
      isError: false,
      error: null,
      refetch,
    } as never);
    render(<MediaTypeAnalytics />);
    expect(screen.getByTestId("media-type-pie-chart")).toHaveAttribute(
      "data-count",
      "2",
    );
  });
});
