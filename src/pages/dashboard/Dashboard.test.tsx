import { render, screen } from "@testing-library/react";
import { useEffect } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useCurrentUser, useScrollRestoration } from "@/hooks";

import { Dashboard } from "./Dashboard";

vi.mock("@/hooks", () => ({
  useCurrentUser: vi.fn(),
  useScrollRestoration: vi.fn(),
}));

vi.mock("./components", () => ({
  DiscoverMovies: vi.fn(() => <div data-testid="discover-movies" />),
}));

describe("Dashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useCurrentUser).mockReturnValue({
      data: null,
      isLoading: false,
    } as never);
  });

  it("renders DiscoverMovies for last three years with correct query", async () => {
    const { DiscoverMovies } = await import("./components");

    render(<Dashboard />);

    const currentYear = new Date().getFullYear();
    const expectedYears = [currentYear, currentYear - 1, currentYear - 2];

    expect(vi.mocked(DiscoverMovies)).toHaveBeenCalledTimes(3);

    expectedYears.forEach((year, index) => {
      const props = vi.mocked(DiscoverMovies).mock.calls[index][0];
      expect(props).toEqual(
        expect.objectContaining({
          query: { primaryReleaseYear: year, sortBy: "vote_count.desc" },
        }),
      );
    });
  });

  it("passes onReady callback to each DiscoverMovies", async () => {
    const { DiscoverMovies } = await import("./components");

    render(<Dashboard />);

    const calls = vi.mocked(DiscoverMovies).mock.calls;
    expect(calls).toHaveLength(3);
    calls.forEach(([props]) => {
      expect(typeof props.onReady).toBe("function");
    });
  });

  it("calls useScrollRestoration with false before all sections are ready", () => {
    render(<Dashboard />);

    expect(vi.mocked(useScrollRestoration)).toHaveBeenCalledWith(false);
  });

  it("calls useScrollRestoration with true after all sections report ready", async () => {
    const { DiscoverMovies } = await import("./components");

    vi.mocked(DiscoverMovies).mockImplementation(({ onReady, query }) => {
      useEffect(() => {
        onReady(query.primaryReleaseYear!);
      }, [onReady, query.primaryReleaseYear]);
      return <div data-testid="discover-movies" />;
    });

    render(<Dashboard />);

    const calls = vi.mocked(useScrollRestoration).mock.calls;
    const lastCall = calls[calls.length - 1];
    expect(lastCall[0]).toBe(true);
  });
  it("shows info banner when user is not logged in", () => {
    vi.mocked(useCurrentUser).mockReturnValue({
      data: null,
      isLoading: false,
    } as never);

    render(<Dashboard />);

    expect(screen.getByText(/Log in or sign up/i)).toBeInTheDocument();
  });

  it("hides info banner when user is logged in", () => {
    vi.mocked(useCurrentUser).mockReturnValue({
      data: { id: "1", email: "test@example.com" },
      isLoading: false,
    } as never);

    render(<Dashboard />);

    expect(screen.queryByText(/Log in or sign up/i)).not.toBeInTheDocument();
  });

  it("hides info banner while user is loading", () => {
    vi.mocked(useCurrentUser).mockReturnValue({
      data: null,
      isLoading: true,
    } as never);

    render(<Dashboard />);

    expect(screen.queryByText(/Log in or sign up/i)).not.toBeInTheDocument();
  });
});
