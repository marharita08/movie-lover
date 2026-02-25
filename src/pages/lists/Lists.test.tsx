import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { RouterKey } from "@/const";
import { useDebounce, useLists } from "@/hooks";

import { Lists } from "./Lists";

vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

vi.mock("@/hooks", () => ({
  useLists: vi.fn(),
  useDebounce: vi.fn((value) => value),
}));

vi.mock("react-intersection-observer", () => ({
  useInView: vi.fn(() => ({ ref: vi.fn(), inView: false })),
}));

vi.mock("@/components", async () => {
  const React = await import("react");
  return {
    Button: ({
      children,
      asChild,
    }: {
      children: React.ReactNode;
      asChild?: boolean;
    }) => (asChild ? <>{children}</> : <button>{children}</button>),
    Input: React.forwardRef<
      HTMLInputElement,
      React.InputHTMLAttributes<HTMLInputElement> & {
        startIcon?: React.ReactNode;
      }
    >(({ startIcon: _startIcon, ...props }, ref) => (
      <input ref={ref} {...props} />
    )),
    Loading: () => <div data-testid="loading" />,
    ErrorState: ({ onRetry }: { onRetry: () => void }) => (
      <div data-testid="error-state">
        <button onClick={onRetry}>Retry</button>
      </div>
    ),
    EmptyState: ({
      title,
      description,
    }: {
      title: string;
      description: string;
    }) => (
      <div data-testid="empty-state">
        <div>{title}</div>
        <div>{description}</div>
      </div>
    ),
  };
});

vi.mock("./components", () => ({
  ListCard: ({ list }: { list: { id: string; name: string } }) => (
    <div data-testid="list-card">{list.name}</div>
  ),
}));

const defaultQueryResult = {
  data: undefined,
  fetchNextPage: vi.fn(),
  hasNextPage: false,
  isFetchingNextPage: false,
  isLoading: false,
  isError: false,
  error: null,
  refetch: vi.fn(),
};

describe("Lists", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useLists).mockReturnValue(defaultQueryResult as never);
  });

  it("shows Loading when isLoading is true", () => {
    vi.mocked(useLists).mockReturnValue({
      ...defaultQueryResult,
      isLoading: true,
    } as never);
    render(<Lists />);
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("shows Loading when isFetchingNextPage is true", () => {
    vi.mocked(useLists).mockReturnValue({
      ...defaultQueryResult,
      data: { pages: [{ results: [{ id: "1", name: "List 1" }] }] },
      isFetchingNextPage: true,
    } as never);
    render(<Lists />);
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("shows ErrorState when isError is true", () => {
    vi.mocked(useLists).mockReturnValue({
      ...defaultQueryResult,
      isError: true,
      error: new Error("Failed"),
    } as never);
    render(<Lists />);
    expect(screen.getByTestId("error-state")).toBeInTheDocument();
  });

  it("calls refetch on retry click", () => {
    const refetch = vi.fn();
    vi.mocked(useLists).mockReturnValue({
      ...defaultQueryResult,
      isError: true,
      error: new Error("Failed"),
      refetch,
    } as never);
    render(<Lists />);
    fireEvent.click(screen.getByText("Retry"));
    expect(refetch).toHaveBeenCalled();
  });

  it("shows EmptyState with default text when no lists and no search", () => {
    vi.mocked(useLists).mockReturnValue({
      ...defaultQueryResult,
      data: { pages: [{ results: [] }] },
    } as never);
    render(<Lists />);
    expect(
      screen.getByText("Ready to analyze your cinema history?"),
    ).toBeInTheDocument();
  });

  it("shows EmptyState with search text when search is active", () => {
    vi.mocked(useDebounce).mockReturnValue("batman");
    vi.mocked(useLists).mockReturnValue({
      ...defaultQueryResult,
      data: { pages: [{ results: [] }] },
    } as never);
    render(<Lists />);
    expect(screen.getByText("No matching lists found")).toBeInTheDocument();
    expect(screen.getByText(/batman/)).toBeInTheDocument();
  });

  it("renders list cards", () => {
    vi.mocked(useLists).mockReturnValue({
      ...defaultQueryResult,
      data: {
        pages: [
          {
            results: [
              { id: "1", name: "List 1" },
              { id: "2", name: "List 2" },
            ],
          },
        ],
      },
    } as never);
    render(<Lists />);
    expect(screen.getAllByTestId("list-card")).toHaveLength(2);
  });

  it("flattens pages into single list", () => {
    vi.mocked(useLists).mockReturnValue({
      ...defaultQueryResult,
      data: {
        pages: [
          { results: [{ id: "1", name: "List 1" }] },
          { results: [{ id: "2", name: "List 2" }] },
        ],
      },
    } as never);
    render(<Lists />);
    expect(screen.getAllByTestId("list-card")).toHaveLength(2);
  });

  it("calls fetchNextPage when inView and hasNextPage", async () => {
    const fetchNextPage = vi.fn();
    const { useInView } = await import("react-intersection-observer");
    vi.mocked(useInView).mockReturnValue({
      ref: vi.fn(),
      inView: true,
    } as never);
    vi.mocked(useLists).mockReturnValue({
      ...defaultQueryResult,
      data: { pages: [{ results: [{ id: "1", name: "List 1" }] }] },
      hasNextPage: true,
      fetchNextPage,
    } as never);
    render(<Lists />);
    expect(fetchNextPage).toHaveBeenCalled();
  });

  it("does not call fetchNextPage when isFetchingNextPage is true", async () => {
    const fetchNextPage = vi.fn();
    const { useInView } = await import("react-intersection-observer");
    vi.mocked(useInView).mockReturnValue({
      ref: vi.fn(),
      inView: true,
    } as never);
    vi.mocked(useLists).mockReturnValue({
      ...defaultQueryResult,
      data: { pages: [{ results: [{ id: "1", name: "List 1" }] }] },
      hasNextPage: true,
      isFetchingNextPage: true,
      fetchNextPage,
    } as never);
    render(<Lists />);
    expect(fetchNextPage).not.toHaveBeenCalled();
  });

  it("shows Create List link", () => {
    render(<Lists />);
    expect(screen.getByText("Create List").closest("a")).toHaveAttribute(
      "href",
      RouterKey.CREATE_LIST,
    );
  });

  it("passes debounced search to useLists", () => {
    vi.mocked(useDebounce).mockReturnValue("batman");
    render(<Lists />);
    expect(useLists).toHaveBeenCalledWith({ name: "batman" });
  });
});
