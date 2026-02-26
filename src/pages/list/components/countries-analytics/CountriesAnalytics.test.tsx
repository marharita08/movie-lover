import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useCountryStats } from "@/hooks";

import { CountriesAnalytics } from "./CountriesAnalytics";

vi.mock("react-router-dom", () => ({
  useParams: () => ({ id: "list-123" }),
}));

vi.mock("@/hooks", () => ({
  useCountryStats: vi.fn(),
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

vi.mock("./WorldMap", () => ({
  WorldMap: ({ data }: { data: { company: string; amount: number }[] }) => (
    <div data-testid="world-map" data-count={data.length} />
  ),
}));

describe("CountriesAnalytics", () => {
  const refetch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows Loading when isLoading is true", () => {
    vi.mocked(useCountryStats).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
      refetch,
    } as never);
    render(<CountriesAnalytics />);
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("shows ErrorState when isError is true", () => {
    vi.mocked(useCountryStats).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error("Failed"),
      refetch,
    } as never);
    render(<CountriesAnalytics />);
    expect(screen.getByTestId("error-state")).toBeInTheDocument();
  });

  it("calls refetch on retry click", () => {
    vi.mocked(useCountryStats).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error("Failed"),
      refetch,
    } as never);
    render(<CountriesAnalytics />);
    fireEvent.click(screen.getByText("Retry"));
    expect(refetch).toHaveBeenCalled();
  });

  it("shows EmptyState when countries are empty", () => {
    vi.mocked(useCountryStats).mockReturnValue({
      data: {},
      isLoading: false,
      isError: false,
      error: null,
      refetch,
    } as never);
    render(<CountriesAnalytics />);
    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
  });

  it("shows WorldMap when countries are present", () => {
    vi.mocked(useCountryStats).mockReturnValue({
      data: { Action: 10, Drama: 5 },
      isLoading: false,
      isError: false,
      error: null,
      refetch,
    } as never);
    render(<CountriesAnalytics />);
    expect(screen.getByTestId("world-map")).toBeInTheDocument();
  });
});
