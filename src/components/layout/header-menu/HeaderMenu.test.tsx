import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { RouterKey } from "@/const";
import { useLogout } from "@/hooks";
import type { User } from "@/types";

import { HeaderMenu } from "./HeaderMenu";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("@/hooks", () => ({
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

describe("HeaderMenu", () => {
  const mutate = vi.fn();
  const user = userEvent.setup();
  const mockUser: User = {
    name: "John Doe",
    email: "test@test.com",
  } as User;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useLogout).mockReturnValue({ mutate } as never);
  });

  it("shows user email", () => {
    render(<HeaderMenu user={mockUser} />);
    expect(screen.getByText("test@test.com")).toBeInTheDocument();
  });

  it("shows avatar fallback with initials", () => {
    render(<HeaderMenu user={mockUser} />);
    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("calls mutate on logout click", async () => {
    render(<HeaderMenu user={mockUser} />);

    await user.click(screen.getByRole("button"));
    await screen.findByText("Logout");
    await user.click(screen.getByText("Logout"));

    expect(mutate).toHaveBeenCalled();
  });

  it("navigates to profile on profile click", async () => {
    render(<HeaderMenu user={mockUser} />);

    await user.click(screen.getByRole("button"));
    await screen.findByText("Profile");
    await user.click(screen.getByText("Profile"));

    expect(mockNavigate).toHaveBeenCalledWith(RouterKey.USER_PROFILE);
  });

  it("shows Profile and Logout menu items when dropdown is opened", async () => {
    render(<HeaderMenu user={mockUser} />);

    await user.click(screen.getByRole("button"));

    expect(await screen.findByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });
});
