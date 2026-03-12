import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useCurrentUser } from "@/hooks";

import { Dashboard } from "./Dashboard";

vi.mock("@/hooks", () => ({
  useCurrentUser: vi.fn(),
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
