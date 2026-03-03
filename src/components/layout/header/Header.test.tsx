import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useCurrentUser } from "@/hooks";

import { Header } from "./Header";

vi.mock("@/hooks", () => ({
  useCurrentUser: vi.fn(),
}));

vi.mock("../header-menu/HeaderMenu", () => ({
  HeaderMenu: vi.fn(({ user }) => (
    <div data-testid="header-menu">
      <span>{user.email}</span>
    </div>
  )),
}));

vi.stubGlobal(
  "matchMedia",
  vi.fn().mockReturnValue({
    matches: false,
    addListener: vi.fn(),
    removeListener: vi.fn(),
  }),
);

const renderWithRouter = (component: React.ReactElement) => {
  return render(<MemoryRouter>{component}</MemoryRouter>);
};

describe("Header", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading when isLoading is true", () => {
    vi.mocked(useCurrentUser).mockReturnValue({
      data: undefined,
      isLoading: true,
    } as never);
    
    renderWithRouter(<Header />);
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("renders HeaderMenu when user is loaded", () => {
    vi.mocked(useCurrentUser).mockReturnValue({
      data: { name: "John Doe", email: "test@test.com" },
      isLoading: false,
    } as never);

    renderWithRouter(<Header />);
    expect(screen.getByTestId("header-menu")).toBeInTheDocument();
  });

  it("shows login and signup links when no user", () => {
    vi.mocked(useCurrentUser).mockReturnValue({
      data: undefined,
      isLoading: false,
    } as never);

    renderWithRouter(<Header />);
    
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Sign Up")).toBeInTheDocument();
  });

  it("renders header title", () => {
    vi.mocked(useCurrentUser).mockReturnValue({
      data: undefined,
      isLoading: false,
    } as never);

    renderWithRouter(<Header />);
    expect(screen.getByText("Movie Lover")).toBeInTheDocument();
  });

  it("does not render login/signup when user is loaded", () => {
    vi.mocked(useCurrentUser).mockReturnValue({
      data: { name: "John Doe", email: "test@test.com" },
      isLoading: false,
    } as never);

    renderWithRouter(<Header />);
    
    expect(screen.queryByText("Login")).not.toBeInTheDocument();
    expect(screen.queryByText("Sign Up")).not.toBeInTheDocument();
  });

  it("does not render HeaderMenu when no user", () => {
    vi.mocked(useCurrentUser).mockReturnValue({
      data: undefined,
      isLoading: false,
    } as never);

    renderWithRouter(<Header />);
    
    expect(screen.queryByTestId("header-menu")).not.toBeInTheDocument();
  });
});
