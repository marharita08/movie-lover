import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAmountStats } from "@/hooks";

import { AmountStats } from "./AmountStats";

vi.mock("react-router-dom", () => ({
  useParams: () => ({ id: "list-123" }),
}));

vi.mock("@/hooks", () => ({
  useAmountStats: vi.fn(),
}));

vi.mock("@/components", () => ({
  Loading: () => <div data-testid="loading" />,
}));

const mockData = {
  total: 42,
  totalMoviesRuntime: 125,
  totalTVShowsRuntime: 60,
  totalRuntime: 185,
};

describe("AmountStats", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading when isLoading is true", () => {
    vi.mocked(useAmountStats).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    } as never);
    render(<AmountStats />);
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("returns null when isError is true", () => {
    vi.mocked(useAmountStats).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    } as never);
    const { container } = render(<AmountStats />);
    expect(container).toBeEmptyDOMElement();
  });

  it("returns null when data is null", () => {
    vi.mocked(useAmountStats).mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
    } as never);
    const { container } = render(<AmountStats />);
    expect(container).toBeEmptyDOMElement();
  });

  it("shows total items count", () => {
    vi.mocked(useAmountStats).mockReturnValue({
      data: mockData,
      isLoading: false,
      isError: false,
    } as never);
    render(<AmountStats />);
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("Total items")).toBeInTheDocument();
  });

  it("formats and shows total movies runtime", () => {
    vi.mocked(useAmountStats).mockReturnValue({
      data: mockData,
      isLoading: false,
      isError: false,
    } as never);
    render(<AmountStats />);
    expect(screen.getByText("2h 5min")).toBeInTheDocument();
    expect(screen.getByText("Total movies runtime")).toBeInTheDocument();
  });

  it("formats and shows total TV shows runtime", () => {
    vi.mocked(useAmountStats).mockReturnValue({
      data: mockData,
      isLoading: false,
      isError: false,
    } as never);
    render(<AmountStats />);
    expect(screen.getByText("1h 0min")).toBeInTheDocument();
    expect(screen.getByText("Total TV shows runtime")).toBeInTheDocument();
  });

  it("formats and shows total runtime", () => {
    vi.mocked(useAmountStats).mockReturnValue({
      data: mockData,
      isLoading: false,
      isError: false,
    } as never);
    render(<AmountStats />);
    expect(screen.getByText("3h 5min")).toBeInTheDocument();
    expect(screen.getByText("Total runtime")).toBeInTheDocument();
  });

  it("calls useAmountStats with correct id", () => {
    vi.mocked(useAmountStats).mockReturnValue({
      data: mockData,
      isLoading: false,
      isError: false,
    } as never);
    render(<AmountStats />);
    expect(useAmountStats).toHaveBeenCalledWith("list-123");
  });
});
