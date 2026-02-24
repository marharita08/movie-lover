import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { MediaType } from "@/const";
import { useListGenres, useListYears, useRatingStats } from "@/hooks";

import { RatingAnalytics } from "./RatingAnalytics";

vi.mock("react-router-dom", () => ({
  useParams: () => ({ id: "list-123" }),
}));

vi.mock("@/hooks", () => ({
  useListGenres: vi.fn(),
  useListYears: vi.fn(),
  useRatingStats: vi.fn(),
}));

vi.mock("@/components", () => ({
  Loading: () => <div data-testid="loading" />,
  ErrorState: ({ onRetry }: { onRetry: () => void }) => (
    <div data-testid="error-state">
      <button onClick={onRetry}>Retry</button>
    </div>
  ),
  Select: ({
    value,
    onValueChange,
    children,
  }: {
    value: string;
    onValueChange: (v: string) => void;
    children: React.ReactNode;
  }) => (
    <div data-testid="select" data-value={value}>
      <select value={value} onChange={(e) => onValueChange(e.target.value)}>
        {children}
      </select>
    </div>
  ),
  SelectTrigger: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  SelectValue: ({ placeholder }: { placeholder: string }) => (
    <option value="">{placeholder}</option>
  ),
  SelectContent: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  SelectItem: ({
    value,
    children,
  }: {
    value: string;
    children: React.ReactNode;
  }) => <option value={value}>{children}</option>,
}));

vi.mock("./RatingBarChart", () => ({
  RatingBarChart: ({
    data,
  }: {
    data: { rating: string; amount: number }[];
  }) => (
    <div data-testid="rating-bar-chart" data-items={JSON.stringify(data)} />
  ),
}));

const defaultQueryResult = {
  data: undefined,
  isLoading: false,
  isError: false,
  error: null,
  refetch: vi.fn(),
};

describe("RatingAnalytics", () => {
  const refetch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useListGenres).mockReturnValue({
      data: ["Action", "Drama"],
    } as never);
    vi.mocked(useListYears).mockReturnValue({
      data: [2020, 2021, 2022],
    } as never);
    vi.mocked(useRatingStats).mockReturnValue(defaultQueryResult as never);
  });

  it("calls useRatingStats with default query", () => {
    render(<RatingAnalytics />);
    expect(useRatingStats).toHaveBeenCalledWith("list-123", {
      genre: undefined,
      year: undefined,
      type: undefined,
    });
  });

  it("shows Loading when isLoading is true", () => {
    vi.mocked(useRatingStats).mockReturnValue({
      ...defaultQueryResult,
      isLoading: true,
    } as never);
    render(<RatingAnalytics />);
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("shows ErrorState when isError is true", () => {
    vi.mocked(useRatingStats).mockReturnValue({
      ...defaultQueryResult,
      isError: true,
      error: new Error("Failed"),
      refetch,
    } as never);
    render(<RatingAnalytics />);
    expect(screen.getByTestId("error-state")).toBeInTheDocument();
  });

  it("calls refetch on retry click", () => {
    vi.mocked(useRatingStats).mockReturnValue({
      ...defaultQueryResult,
      isError: true,
      error: new Error("Failed"),
      refetch,
    } as never);
    render(<RatingAnalytics />);
    fireEvent.click(screen.getByText("Retry"));
    expect(refetch).toHaveBeenCalled();
  });

  it("shows RatingBarChart when data is present", () => {
    vi.mocked(useRatingStats).mockReturnValue({
      ...defaultQueryResult,
      data: { "8": 10, "7": 5 },
    } as never);
    render(<RatingAnalytics />);
    expect(screen.getByTestId("rating-bar-chart")).toBeInTheDocument();
  });

  it("sorts chart data by rating in ascending order", () => {
    vi.mocked(useRatingStats).mockReturnValue({
      ...defaultQueryResult,
      data: { "8": 10, "5": 3, "7": 5 },
    } as never);
    render(<RatingAnalytics />);
    const chart = screen.getByTestId("rating-bar-chart");
    const items = JSON.parse(chart.getAttribute("data-items")!);
    expect(items.map((i: { rating: string }) => i.rating)).toEqual([
      "5",
      "7",
      "8",
    ]);
  });

  it("updates genre query when genre filter changes", () => {
    render(<RatingAnalytics />);
    const selects = screen.getAllByRole("combobox");
    fireEvent.change(selects[0], { target: { value: "Action" } });
    expect(useRatingStats).toHaveBeenLastCalledWith(
      "list-123",
      expect.objectContaining({ genre: "Action" }),
    );
  });

  it("updates year query when year filter changes", () => {
    render(<RatingAnalytics />);
    const selects = screen.getAllByRole("combobox");
    fireEvent.change(selects[1], { target: { value: "2021" } });
    expect(useRatingStats).toHaveBeenLastCalledWith(
      "list-123",
      expect.objectContaining({ year: 2021 }),
    );
  });

  it("updates mediaType query when media type filter changes", () => {
    render(<RatingAnalytics />);
    const selects = screen.getAllByRole("combobox");
    fireEvent.change(selects[2], { target: { value: MediaType.MOVIE } });
    expect(useRatingStats).toHaveBeenLastCalledWith(
      "list-123",
      expect.objectContaining({ type: MediaType.MOVIE }),
    );
  });

  it('passes undefined for genre when "all" is selected', () => {
    render(<RatingAnalytics />);
    const selects = screen.getAllByRole("combobox");
    fireEvent.change(selects[0], { target: { value: "Action" } });
    fireEvent.change(selects[0], { target: { value: "all" } });
    expect(useRatingStats).toHaveBeenLastCalledWith(
      "list-123",
      expect.objectContaining({ genre: undefined }),
    );
  });
});
