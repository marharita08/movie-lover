import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { PersonRole, personRoleMap } from "@/const";
import { usePersonStats } from "@/hooks";

import { PersonsAnalytics } from "./PersonsAnalytics";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", () => ({
  useParams: () => ({ id: "list-123", role: PersonRole.DIRECTOR }),
  useNavigate: () => mockNavigate,
}));

vi.mock("@/hooks", () => ({
  usePersonStats: vi.fn(),
}));

vi.mock("react-intersection-observer", () => ({
  useInView: vi.fn(() => ({ ref: vi.fn(), inView: false })),
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

describe("PersonsAnalitics", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(usePersonStats).mockReturnValue(defaultQueryResult as never);
  });

  it("calls usePersonStats with correct params", () => {
    render(<PersonsAnalytics />);
    expect(usePersonStats).toHaveBeenCalledWith("list-123", {
      role: PersonRole.DIRECTOR,
      limit: 20,
    });
  });

  it("shows correct heading based on role", () => {
    render(<PersonsAnalytics />);
    expect(
      screen.getByText(personRoleMap[PersonRole.DIRECTOR]),
    ).toBeInTheDocument();
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

  it("renders persons when data is present", () => {
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

  it("flattens pages into single list", () => {
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

  it("calls fetchNextPage when inView and hasNextPage", async () => {
    const fetchNextPage = vi.fn();
    const { useInView } = await import("react-intersection-observer");
    vi.mocked(useInView).mockReturnValue({
      ref: vi.fn(),
      inView: true,
    } as never);
    vi.mocked(usePersonStats).mockReturnValue({
      ...defaultQueryResult,
      data: { pages: [{ results: [{ id: "1", name: "Person 1" }] }] },
      hasNextPage: true,
      fetchNextPage,
    } as never);
    render(<PersonsAnalytics />);
    expect(fetchNextPage).toHaveBeenCalled();
  });

  it("does not call fetchNextPage when isFetchingNextPage is true", async () => {
    const fetchNextPage = vi.fn();
    const { useInView } = await import("react-intersection-observer");
    vi.mocked(useInView).mockReturnValue({
      ref: vi.fn(),
      inView: true,
    } as never);
    vi.mocked(usePersonStats).mockReturnValue({
      ...defaultQueryResult,
      data: { pages: [{ results: [{ id: "1", name: "Person 1" }] }] },
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
});
