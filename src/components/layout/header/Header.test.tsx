import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { en } from "@/const/translations/en";
import { useCurrentUser } from "@/hooks";

import { Header } from "./Header";

vi.mock("@/hooks", () => ({
  useTranslation: () => ({ t: (k: keyof typeof en) => en[k] || k }),
  useCurrentUser: vi.fn(),
  useUpdateUser: vi.fn(),
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

const renderWithRouter = (component: React.ReactElement) =>
  render(<MemoryRouter>{component}</MemoryRouter>);

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

  it("shows auth links when no user", () => {
    vi.mocked(useCurrentUser).mockReturnValue({
      data: undefined,
      isLoading: false,
    } as never);

    renderWithRouter(<Header />);

    expect(screen.getByTestId("auth-links")).toBeInTheDocument();
  });

  it("renders header title", () => {
    vi.mocked(useCurrentUser).mockReturnValue({
      data: undefined,
      isLoading: false,
    } as never);

    renderWithRouter(<Header />);

    expect(screen.getByTestId("header-title")).toHaveTextContent("Movie Lover");
  });

  it("does not render auth links when user is loaded", () => {
    vi.mocked(useCurrentUser).mockReturnValue({
      data: { name: "John Doe", email: "test@test.com" },
      isLoading: false,
    } as never);

    renderWithRouter(<Header />);

    expect(screen.queryByTestId("auth-links")).not.toBeInTheDocument();
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
