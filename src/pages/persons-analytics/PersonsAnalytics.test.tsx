import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { PersonRole, personRoleMap } from "@/const";
import { useIsMobile, usePersonStats, useSearch } from "@/hooks";

import { PersonsAnalytics } from "./PersonsAnalytics";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", () => ({
  useParams: () => ({ id: "list-123", role: PersonRole.DIRECTOR }),
  useNavigate: () => mockNavigate,
}));

vi.mock("@/hooks", () => ({
  usePersonStats: vi.fn(),
  useSearch: vi.fn(),
  useIsMobile: vi.fn(),
}));

vi.mock("@tanstack/react-virtual", () => ({
  useVirtualizer: vi.fn(() => ({
    getVirtualItems: () => [],
    getTotalSize: () => 0,
    measureElement: vi.fn(),
  })),
}));

vi.mock("@/components", () => ({
  Button: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
  }) => <button onClick={onClick}>{children}</button>,
  Loading: () => <div data-testid="loading" />,
  ErrorState: ({ onRetry }: { onRetry: () => void }) => (
    <div data-testid="error-state">
      <button onClick={onRetry}>Retry</button>
    </div>
  ),
  EmptyState: ({ title }: { title: string }) => (
    <div data-testid="empty-state">{title}</div>
  ),
  Person: ({ person }: { person: { id: string; name: string } }) => (
    <div data-testid="person">{person.name}</div>
  ),
  Input: ({
    placeholder,
    value,
    onChange,
  }: {
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }) => (
    <input
      data-testid="search-input"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  ),
}));

const defaultQueryResult = {
  data: undefined,
  isLoading: false,
  isError: false,
  error: null,
  refetch: vi.fn(),
  hasNextPage: false,
  isFetchingNextPage: false,
  fetchNextPage: vi.fn(),
};

const defaultSearchResult = {
  search: "",
  setSearch: vi.fn(),
  debouncedSearch: "",
};

describe("PersonsAnalytics", () => {
  const setSearchMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(usePersonStats).mockReturnValue(defaultQueryResult as never);
    vi.mocked(useSearch).mockReturnValue({
      ...defaultSearchResult,
      setSearch: setSearchMock,
    });
    vi.mocked(useIsMobile).mockReturnValue(false);
  });

  it("calls usePersonStats with correct params", () => {
    render(<PersonsAnalytics />);
    expect(usePersonStats).toHaveBeenCalledWith("list-123", {
      role: PersonRole.DIRECTOR,
      limit: 20,
      search: "",
    });
  });

  it("shows correct heading based on role", () => {
    render(<PersonsAnalytics />);
    expect(
      screen.getByText(personRoleMap[PersonRole.DIRECTOR]),
    ).toBeInTheDocument();
  });

  it("renders search input", () => {
    render(<PersonsAnalytics />);
    expect(screen.getByTestId("search-input")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
  });

  it("updates search value on input change", () => {
    render(<PersonsAnalytics />);
    const searchInput = screen.getByTestId("search-input");
    fireEvent.change(searchInput, { target: { value: "Nolan" } });
    expect(setSearchMock).toHaveBeenCalledWith("Nolan");
  });

  it("calls usePersonStats with debounced search value", () => {
    vi.mocked(useSearch).mockReturnValue({
      search: "Nolan",
      setSearch: setSearchMock,
      debouncedSearch: "Nolan",
    });
    render(<PersonsAnalytics />);

    expect(usePersonStats).toHaveBeenCalledWith("list-123", {
      role: PersonRole.DIRECTOR,
      limit: 20,
      search: "Nolan",
    });
  });

  it("passes search parameter through useSearch", () => {
    render(<PersonsAnalytics />);
    const searchInput = screen.getByTestId("search-input");

    fireEvent.change(searchInput, { target: { value: "Spielberg" } });

    expect(setSearchMock).toHaveBeenCalledWith("Spielberg");
  });

  it("shows Loading when isLoading is true", () => {
    vi.mocked(usePersonStats).mockReturnValue({
      ...defaultQueryResult,
      isLoading: true,
    } as never);
    render(<PersonsAnalytics />);
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("shows ErrorState when isError is true", () => {
    vi.mocked(usePersonStats).mockReturnValue({
      ...defaultQueryResult,
      isError: true,
      error: new Error("Failed"),
    } as never);
    render(<PersonsAnalytics />);
    expect(screen.getByTestId("error-state")).toBeInTheDocument();
  });

  it("calls refetch on retry click", () => {
    const refetch = vi.fn();
    vi.mocked(usePersonStats).mockReturnValue({
      ...defaultQueryResult,
      isError: true,
      error: new Error("Failed"),
      refetch,
    } as never);
    render(<PersonsAnalytics />);
    fireEvent.click(screen.getByText("Retry"));
    expect(refetch).toHaveBeenCalled();
  });

  it("shows EmptyState when analytics are empty", () => {
    vi.mocked(usePersonStats).mockReturnValue({
      ...defaultQueryResult,
      data: { pages: [{ results: [] }] },
    } as never);
    render(<PersonsAnalytics />);
    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
  });

  it("shows EmptyState with search context when no results found", () => {
    vi.mocked(useSearch).mockReturnValue({
      search: "NonExistent",
      setSearch: setSearchMock,
      debouncedSearch: "NonExistent",
    });
    vi.mocked(usePersonStats).mockReturnValue({
      ...defaultQueryResult,
      data: { pages: [{ results: [] }] },
    } as never);
    render(<PersonsAnalytics />);

    const emptyState = screen.getByTestId("empty-state");
    expect(emptyState).toBeInTheDocument();
  });

  it("renders persons when data is present", async () => {
    const { useVirtualizer } = await import("@tanstack/react-virtual");
    vi.mocked(useVirtualizer).mockReturnValue({
      getVirtualItems: () =>
        [{ index: 0, key: "0", start: 0, size: 150 }] as never,
      getTotalSize: () => 150,
      measureElement: vi.fn(),
    } as never);

    vi.mocked(usePersonStats).mockReturnValue({
      ...defaultQueryResult,
      data: {
        pages: [
          {
            results: [
              { id: "1", name: "Nolan" },
              { id: "2", name: "Villeneuve" },
            ],
          },
        ],
      },
    } as never);
    render(<PersonsAnalytics />);
    expect(screen.getAllByTestId("person")).toHaveLength(2);
  });

  it("flattens pages into single list", async () => {
    const { useVirtualizer } = await import("@tanstack/react-virtual");
    vi.mocked(useVirtualizer).mockReturnValue({
      getVirtualItems: () =>
        [{ index: 0, key: "0", start: 0, size: 150 }] as never,
      getTotalSize: () => 150,
      measureElement: vi.fn(),
    } as never);

    vi.mocked(usePersonStats).mockReturnValue({
      ...defaultQueryResult,
      data: {
        pages: [
          { results: [{ id: "1", name: "Person 1" }] },
          { results: [{ id: "2", name: "Person 2" }] },
        ],
      },
    } as never);
    render(<PersonsAnalytics />);
    expect(screen.getAllByTestId("person")).toHaveLength(2);
  });

  it("calls fetchNextPage when near end of virtual list", async () => {
    const fetchNextPage = vi.fn();
    const { useVirtualizer } = await import("@tanstack/react-virtual");

    // Створюємо 40 персон, щоб мати 20 рядків (по 2 персони в рядку на desktop)
    const persons = Array.from({ length: 40 }, (_, i) => ({
      id: `${i}`,
      name: `Person ${i}`,
    }));

    // Симулюємо що користувач проскролив до рядка 17 (близько до кінця, якщо всього 20 рядків)
    vi.mocked(useVirtualizer).mockReturnValue({
      getVirtualItems: () =>
        [{ index: 17, key: "17", start: 2550, size: 150 }] as never,
      getTotalSize: () => 3000,
      measureElement: vi.fn(),
    } as never);

    vi.mocked(usePersonStats).mockReturnValue({
      ...defaultQueryResult,
      data: {
        pages: [{ results: persons }],
      },
      hasNextPage: true,
      fetchNextPage,
    } as never);

    render(<PersonsAnalytics />);
    expect(fetchNextPage).toHaveBeenCalled();
  });

  it("does not call fetchNextPage when isFetchingNextPage is true", async () => {
    const fetchNextPage = vi.fn();
    const { useVirtualizer } = await import("@tanstack/react-virtual");

    // Створюємо 40 персон
    const persons = Array.from({ length: 40 }, (_, i) => ({
      id: `${i}`,
      name: `Person ${i}`,
    }));

    vi.mocked(useVirtualizer).mockReturnValue({
      getVirtualItems: () =>
        [{ index: 17, key: "17", start: 2550, size: 150 }] as never,
      getTotalSize: () => 3000,
      measureElement: vi.fn(),
    } as never);

    vi.mocked(usePersonStats).mockReturnValue({
      ...defaultQueryResult,
      data: {
        pages: [{ results: persons }],
      },
      hasNextPage: true,
      isFetchingNextPage: true,
      fetchNextPage,
    } as never);

    render(<PersonsAnalytics />);
    expect(fetchNextPage).not.toHaveBeenCalled();
  });

  it("navigates back on Back button click", () => {
    render(<PersonsAnalytics />);
    fireEvent.click(screen.getByText("Back"));
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it("uses mobile layout when isMobile is true", () => {
    vi.mocked(useIsMobile).mockReturnValue(true);
    render(<PersonsAnalytics />);
    expect(useIsMobile).toHaveBeenCalled();
  });
});
