import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { RouterKey } from "@/const";
import { en } from "@/const/translations/en";
import { useLists, useSearch } from "@/hooks";

import { Lists } from "./Lists";

vi.mock("react-router-dom", () => {
  return {
    useNavigate: () => vi.fn(),
    Link: ({ children, to, ...rest }: any) => {
      const arr = React.Children.toArray(children);
      if (arr.length === 1 && React.isValidElement(arr[0])) {
        return React.cloneElement(arr[0] as any, { href: to, ...rest });
      }
      const mapped = arr.map((child: any) =>
        React.isValidElement(child)
          ? React.cloneElement(child, { href: to, ...rest })
          : child,
      );
      return React.createElement("a", { href: to, ...rest }, mapped);
    },
  };
});

vi.mock("@/hooks", () => ({
  useTranslation: () => ({ t: (k: keyof typeof en) => en[k] || k }),
  useLists: vi.fn(),
  useSearch: vi.fn(),
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
        <button data-testid="retry-btn" onClick={onRetry}>
          Retry
        </button>
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
        <div data-testid="empty-title">{title}</div>
        <div data-testid="empty-desc">{description}</div>
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

const defaultSearchResult = {
  search: "",
  setSearch: vi.fn(),
  debouncedSearch: "",
};

describe("Lists", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useLists).mockReturnValue(defaultQueryResult as never);
    vi.mocked(useSearch).mockReturnValue(defaultSearchResult);
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
    fireEvent.click(screen.getByTestId("retry-btn"));
    expect(refetch).toHaveBeenCalled();
  });

  it("shows EmptyState with default text when no lists and no search", () => {
    vi.mocked(useLists).mockReturnValue({
      ...defaultQueryResult,
      data: { pages: [{ results: [] }] },
    } as never);
    render(<Lists />);
    expect(screen.getByTestId("empty-title")).toHaveTextContent(
      "Ready to analyze your cinema history?",
    );
  });

  it("shows EmptyState with search text when search is active", () => {
    vi.mocked(useSearch).mockReturnValue({
      search: "batman",
      setSearch: vi.fn(),
      debouncedSearch: "batman",
    });
    vi.mocked(useLists).mockReturnValue({
      ...defaultQueryResult,
      data: { pages: [{ results: [] }] },
    } as never);
    render(<Lists />);
    expect(screen.getByTestId("empty-title")).toHaveTextContent(
      "No matching lists found",
    );
    expect(screen.getByTestId("empty-desc")).toHaveTextContent(/batman/);
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
    expect(screen.getByTestId("create-list-link")).toHaveAttribute(
      "href",
      RouterKey.CREATE_LIST,
    );
  });

  it("passes debounced search to useLists", () => {
    vi.mocked(useSearch).mockReturnValue({
      search: "batman",
      setSearch: vi.fn(),
      debouncedSearch: "batman",
    });
    render(<Lists />);
    expect(useLists).toHaveBeenCalledWith({ name: "batman" });
  });
});
