import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { PersonRole, personRoleMap } from "@/const";
import { usePersonStats } from "@/hooks";

import { PersonsAnalytics } from "./PersonsAnalytics";

vi.mock("react-router-dom", () => ({
  useParams: () => ({ id: "list-123" }),
  generatePath: (_path: string, params: Record<string, string>) =>
    `/list/${params.id}/persons/${params.role}`,
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

vi.mock("@/hooks", () => ({
  usePersonStats: vi.fn(),
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
  Person: ({ person }: { person: { id: string; name: string } }) => (
    <div data-testid="person">{person.name}</div>
  ),
  Button: ({
    children,
    asChild,
  }: {
    children: React.ReactNode;
    asChild?: boolean;
  }) => (asChild ? <>{children}</> : <button>{children}</button>),
}));

const defaultQueryResult = {
  data: undefined,
  isLoading: false,
  isError: false,
  error: null,
  refetch: vi.fn(),
};

describe("PersonsAnalytics", () => {
  const refetch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(usePersonStats).mockReturnValue(defaultQueryResult as never);
  });

  it("calls usePersonStats with correct id and role", () => {
    render(<PersonsAnalytics role={PersonRole.DIRECTOR} />);
    expect(usePersonStats).toHaveBeenCalledWith("list-123", {
      role: PersonRole.DIRECTOR,
      limit: 10,
    });
  });

  it("shows correct heading based on role", () => {
    render(<PersonsAnalytics role={PersonRole.DIRECTOR} />);
    expect(
      screen.getByText(personRoleMap[PersonRole.DIRECTOR]),
    ).toBeInTheDocument();
  });

  it("shows Loading when isLoading is true", () => {
    vi.mocked(usePersonStats).mockReturnValue({
      ...defaultQueryResult,
      isLoading: true,
    } as never);
    render(<PersonsAnalytics role={PersonRole.DIRECTOR} />);
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("shows ErrorState when isError is true", () => {
    vi.mocked(usePersonStats).mockReturnValue({
      ...defaultQueryResult,
      isLoading: false,
      isError: true,
      error: new Error("Failed"),
      refetch,
    } as never);
    render(<PersonsAnalytics role={PersonRole.DIRECTOR} />);
    expect(screen.getByTestId("error-state")).toBeInTheDocument();
  });

  it("calls refetch on retry click", () => {
    vi.mocked(usePersonStats).mockReturnValue({
      ...defaultQueryResult,
      isLoading: false,
      isError: true,
      error: new Error("Failed"),
      refetch,
    } as never);
    render(<PersonsAnalytics role={PersonRole.DIRECTOR} />);
    fireEvent.click(screen.getByText("Retry"));
    expect(refetch).toHaveBeenCalled();
  });

  it("shows EmptyState when analytics are empty", () => {
    vi.mocked(usePersonStats).mockReturnValue({
      ...defaultQueryResult,
      data: { pages: [{ results: [] }] },
    } as never);
    render(<PersonsAnalytics role={PersonRole.DIRECTOR} />);
    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
  });

  it("renders persons when data is present", () => {
    vi.mocked(usePersonStats).mockReturnValue({
      ...defaultQueryResult,
      data: {
        pages: [
          {
            results: [
              { id: "1", name: "Christopher Nolan" },
              { id: "2", name: "Denis Villeneuve" },
            ],
          },
        ],
      },
    } as never);
    render(<PersonsAnalytics role={PersonRole.DIRECTOR} />);
    expect(screen.getAllByTestId("person")).toHaveLength(2);
  });

  it("flattens pages into single list of persons", () => {
    vi.mocked(usePersonStats).mockReturnValue({
      ...defaultQueryResult,
      data: {
        pages: [
          { results: [{ id: "1", name: "Person 1" }] },
          { results: [{ id: "2", name: "Person 2" }] },
        ],
      },
    } as never);
    render(<PersonsAnalytics role={PersonRole.DIRECTOR} />);
    expect(screen.getAllByTestId("person")).toHaveLength(2);
  });

  it("shows View all link with correct path", () => {
    vi.mocked(usePersonStats).mockReturnValue({
      ...defaultQueryResult,
      data: {
        pages: [{ results: [{ id: "1", name: "Person 1" }] }],
      },
    } as never);
    render(<PersonsAnalytics role={PersonRole.DIRECTOR} />);
    const link = screen.getByText("View all");
    expect(link).toHaveAttribute("href", expect.stringContaining("list-123"));
  });
});
