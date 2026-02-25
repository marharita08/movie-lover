import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { RouterKey } from "@/const";
import { useCurrentUser, useLogout } from "@/hooks";

import { Header } from "./Header";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("@/hooks", () => ({
  useCurrentUser: vi.fn(),
  useLogout: vi.fn(),
}));

vi.stubGlobal(
  "matchMedia",
  vi.fn().mockReturnValue({
    matches: false,
    addListener: vi.fn(),
    removeListener: vi.fn(),
  }),
);

describe("Header", () => {
  const mutate = vi.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useLogout).mockReturnValue({ mutate } as never);
  });

  it("shows loading when isLoading is true", () => {
    vi.mocked(useCurrentUser).mockReturnValue({
      data: undefined,
      isLoading: true,
    } as never);
    render(<Header />);
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("shows user email when loaded", () => {
    vi.mocked(useCurrentUser).mockReturnValue({
      data: { name: "John Doe", email: "test@test.com" },
      isLoading: false,
    } as never);

    render(<Header />);
    expect(screen.getByText("test@test.com")).toBeInTheDocument();
  });

  it("shows avatar fallback with initials", () => {
    vi.mocked(useCurrentUser).mockReturnValue({
      data: { name: "John Doe", email: "test@test.com" },
      isLoading: false,
    } as never);

    render(<Header />);
    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("calls mutate on logout click", async () => {
    vi.mocked(useCurrentUser).mockReturnValue({
      data: { name: "John Doe", email: "test@test.com" },
      isLoading: false,
    } as never);

    render(<Header />);

    await user.click(screen.getByRole("button"));
    await screen.findByText("Logout");
    await user.click(screen.getByText("Logout"));

    expect(mutate).toHaveBeenCalled();
  });

  it("navigates to profile on profile click", async () => {
    vi.mocked(useCurrentUser).mockReturnValue({
      data: { name: "John Doe", email: "test@test.com" },
      isLoading: false,
    } as never);

    render(<Header />);

    await user.click(screen.getByRole("button"));
    await screen.findByText("Profile");
    await user.click(screen.getByText("Profile"));

    expect(mockNavigate).toHaveBeenCalledWith(RouterKey.USER_PROFILE);
  });
});
