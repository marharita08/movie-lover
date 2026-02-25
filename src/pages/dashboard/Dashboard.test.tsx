import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Dashboard } from "./Dashboard";

vi.mock("./components", () => ({
  DiscoverMovies: vi.fn(() => <div data-testid="discover-movies" />),
}));

describe("Dashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
          query: {
            primaryReleaseYear: year,
            sortBy: "vote_count.desc",
          },
        }),
      );
    });
  });
});
