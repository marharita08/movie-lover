import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { RouterKey } from "@/const";
import { en } from "@/const/translations/en";
import { useLogout } from "@/hooks";
import type { User } from "@/types";

import { HeaderMenu } from "./HeaderMenu";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("@/hooks", () => ({
  useTranslation: () => ({ t: (k: keyof typeof en) => en[k] || k }),
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
    expect(screen.getByTestId("user-email")).toHaveTextContent("test@test.com");
  });

  it("shows avatar fallback with initials", () => {
    render(<HeaderMenu user={mockUser} />);
    expect(screen.getByTestId("avatar-initials")).toHaveTextContent("JD");
  });

  it("calls mutate on logout click", async () => {
    render(<HeaderMenu user={mockUser} />);

    await user.click(screen.getByTestId("menu-trigger"));
    await user.click(screen.getByTestId("menu-logout"));

    expect(mutate).toHaveBeenCalled();
  });

  it("navigates to profile on profile click", async () => {
    render(<HeaderMenu user={mockUser} />);

    await user.click(screen.getByTestId("menu-trigger"));
    await user.click(screen.getByTestId("menu-profile"));

    expect(mockNavigate).toHaveBeenCalledWith(RouterKey.USER_PROFILE);
  });

  it("shows menu items when dropdown is opened", async () => {
    render(<HeaderMenu user={mockUser} />);

    await user.click(screen.getByTestId("menu-trigger"));

    expect(screen.getByTestId("menu-profile")).toBeInTheDocument();
    expect(screen.getByTestId("menu-logout")).toBeInTheDocument();
  });
});
