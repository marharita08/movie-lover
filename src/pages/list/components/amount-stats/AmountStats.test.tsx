import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { en } from "@/const/translations/en";
import { useAmountStats } from "@/hooks";

import { AmountStats } from "./AmountStats";

vi.mock("react-router-dom", () => ({
  useParams: () => ({ id: "list-123" }),
}));

vi.mock("@/hooks", () => ({
  useTranslation: () => ({ t: (k: keyof typeof en) => en[k] || k }),
  useAmountStats: vi.fn(),
}));

vi.mock("@/components", () => ({
  Loading: () => <div data-testid="loading" />,
  Tooltip: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="tooltip">{children}</div>
  ),
  TooltipContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="tooltip-content">{children}</div>
  ),
  TooltipTrigger: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="tooltip-trigger">{children}</div>
  ),
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
    expect(screen.getByTestId("amount-total")).toHaveTextContent("42");
    expect(screen.getByTestId("amount-total-label")).toHaveTextContent(
      "Total items",
    );
  });

  it("formats and shows total movies runtime", () => {
    vi.mocked(useAmountStats).mockReturnValue({
      data: mockData,
      isLoading: false,
      isError: false,
    } as never);
    render(<AmountStats />);
    expect(screen.getByTestId("amount-movies-runtime")).toHaveTextContent(
      "2h 5min",
    );
    expect(screen.getByTestId("amount-movies-runtime-label")).toHaveTextContent(
      "Total movies runtime",
    );
  });

  it("formats and shows total TV shows runtime", () => {
    vi.mocked(useAmountStats).mockReturnValue({
      data: mockData,
      isLoading: false,
      isError: false,
    } as never);
    render(<AmountStats />);
    expect(screen.getByTestId("amount-tv-runtime")).toHaveTextContent(
      "1h 0min",
    );
    expect(screen.getByTestId("amount-tv-runtime-label")).toHaveTextContent(
      "Total TV shows runtime",
    );
  });

  it("formats and shows total runtime", () => {
    vi.mocked(useAmountStats).mockReturnValue({
      data: mockData,
      isLoading: false,
      isError: false,
    } as never);
    render(<AmountStats />);
    expect(screen.getByTestId("amount-total-runtime")).toHaveTextContent(
      "3h 5min",
    );
    expect(screen.getByTestId("amount-total-runtime")).toHaveTextContent(
      "3h 5min",
    );
    expect(screen.getByTestId("amount-total-runtime-label")).toHaveTextContent(
      "Total runtime",
    );
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
