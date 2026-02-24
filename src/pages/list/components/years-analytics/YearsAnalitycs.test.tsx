import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useYearsStats } from "@/hooks";

import { YearsAnalytics } from "./YearsAnalytics";

vi.mock("react-router-dom", () => ({
  useParams: () => ({ id: "list-123" }),
}));

vi.mock("@/hooks", () => ({
  useYearsStats: vi.fn(),
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

vi.mock("./YearsBarChart", () => ({
  YearsBarChart: ({ data }: { data: { year: string; amount: number }[] }) => (
    <div data-testid="years-bar-chart" data-items={JSON.stringify(data)} />
  ),
}));

const defaultQueryResult = {
  data: undefined,
  isLoading: false,
  isError: false,
  error: null,
  refetch: vi.fn(),
};

describe("YearsAnalytics", () => {
  const refetch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useYearsStats).mockReturnValue(defaultQueryResult as never);
  });

  it("calls useYearsStats with correct id", () => {
    render(<YearsAnalytics />);
    expect(useYearsStats).toHaveBeenCalledWith("list-123");
  });

  it("shows Loading when isLoading is true", () => {
    vi.mocked(useYearsStats).mockReturnValue({
      ...defaultQueryResult,
      isLoading: true,
    } as never);
    render(<YearsAnalytics />);
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("shows ErrorState when isError is true", () => {
    vi.mocked(useYearsStats).mockReturnValue({
      ...defaultQueryResult,
      isError: true,
      error: new Error("Failed"),
      refetch,
    } as never);
    render(<YearsAnalytics />);
    expect(screen.getByTestId("error-state")).toBeInTheDocument();
  });

  it("calls refetch on retry click", () => {
    vi.mocked(useYearsStats).mockReturnValue({
      ...defaultQueryResult,
      isError: true,
      error: new Error("Failed"),
      refetch,
    } as never);
    render(<YearsAnalytics />);
    fireEvent.click(screen.getByText("Retry"));
    expect(refetch).toHaveBeenCalled();
  });

  it("shows EmptyState when chart data is empty", () => {
    vi.mocked(useYearsStats).mockReturnValue({
      ...defaultQueryResult,
      data: {},
    } as never);
    render(<YearsAnalytics />);
    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
  });

  it("shows YearsBarChart when data is present", () => {
    vi.mocked(useYearsStats).mockReturnValue({
      ...defaultQueryResult,
      data: { "2020": 5, "2021": 10 },
    } as never);
    render(<YearsAnalytics />);
    expect(screen.getByTestId("years-bar-chart")).toBeInTheDocument();
  });

  it("correctly transforms data object to array", () => {
    vi.mocked(useYearsStats).mockReturnValue({
      ...defaultQueryResult,
      data: { "2020": 5, "2021": 10 },
    } as never);
    render(<YearsAnalytics />);
    const chart = screen.getByTestId("years-bar-chart");
    const items = JSON.parse(chart.getAttribute("data-items")!);
    expect(items).toEqual([
      { year: "2020", amount: 5 },
      { year: "2021", amount: 10 },
    ]);
  });
});
