import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useCompanyStats } from "@/hooks";

import { CompaniesAnalytics } from "./CompaniesAnalytics";

vi.mock("react-router-dom", () => ({
  useParams: () => ({ id: "list-123" }),
}));

vi.mock("@/hooks", () => ({
  useCompanyStats: vi.fn(),
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

vi.mock("./CompaniesBarChart", () => ({
  CompaniesBarChart: ({
    data,
  }: {
    data: { company: string; amount: number }[];
  }) => <div data-testid="companies-bar-chart" data-count={data.length} />,
}));

describe("CompaniesAnalytics", () => {
  const refetch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows Loading when isLoading is true", () => {
    vi.mocked(useCompanyStats).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
      refetch,
    } as never);
    render(<CompaniesAnalytics />);
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("shows ErrorState when isError is true", () => {
    vi.mocked(useCompanyStats).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error("Failed"),
      refetch,
    } as never);
    render(<CompaniesAnalytics />);
    expect(screen.getByTestId("error-state")).toBeInTheDocument();
  });

  it("calls refetch on retry click", () => {
    vi.mocked(useCompanyStats).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error("Failed"),
      refetch,
    } as never);
    render(<CompaniesAnalytics />);
    fireEvent.click(screen.getByText("Retry"));
    expect(refetch).toHaveBeenCalled();
  });

  it("shows EmptyState when companies are empty", () => {
    vi.mocked(useCompanyStats).mockReturnValue({
      data: {},
      isLoading: false,
      isError: false,
      error: null,
      refetch,
    } as never);
    render(<CompaniesAnalytics />);
    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
  });

  it("shows CompaniesBarChart when companies are present", () => {
    vi.mocked(useCompanyStats).mockReturnValue({
      data: { Action: 10, Drama: 5 },
      isLoading: false,
      isError: false,
      error: null,
      refetch,
    } as never);
    render(<CompaniesAnalytics />);
    expect(screen.getByTestId("companies-bar-chart")).toBeInTheDocument();
  });

  it("correctly transforms data object to array for CompaniesBarChart", () => {
    vi.mocked(useCompanyStats).mockReturnValue({
      data: { Action: 10, Drama: 5 },
      isLoading: false,
      isError: false,
      error: null,
      refetch,
    } as never);
    render(<CompaniesAnalytics />);
    expect(screen.getByTestId("companies-bar-chart")).toHaveAttribute(
      "data-count",
      "2",
    );
  });
});
