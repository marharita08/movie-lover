import { beforeEach, describe, expect, it, vi } from "vitest";

import { OtpPurpose } from "@/const";

import { httpService } from "../http/http.service";
import { AuthService } from "./auth.service";

vi.mock("../http/http.service", () => ({
  httpService: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("AuthService", () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
    vi.clearAllMocks();
  });

  describe("login", () => {
    it("calls httpService.post with correct url and data", async () => {
      const data = { email: "test@test.com", password: "123456" };
      vi.mocked(httpService.post).mockResolvedValue({ accessToken: "token" });

      await authService.login(data);

      expect(httpService.post).toHaveBeenCalledWith("/auth/login", data);
    });
  });

  describe("signup", () => {
    it("calls httpService.post with correct url and data", async () => {
      const data = { email: "test@test.com", password: "123456", name: "John" };
      vi.mocked(httpService.post).mockResolvedValue({ message: "Success" });

      await authService.signup(data);

      expect(httpService.post).toHaveBeenCalledWith("/auth/signup", data);
    });
  });

  describe("verifyEmail", () => {
    it("calls httpService.post with correct url and data", async () => {
      const data = { email: "test@test.com", code: "1234" };
      vi.mocked(httpService.post).mockResolvedValue({ accessToken: "token" });

      await authService.verifyEmail(data);

      expect(httpService.post).toHaveBeenCalledWith("/auth/verify-email", data);
    });
  });

  describe("getCurrentUser", () => {
    it("calls httpService.get with correct url", async () => {
      vi.mocked(httpService.get).mockResolvedValue({
        id: "1",
        email: "test@test.com",
      });

      await authService.getCurrentUser();

      expect(httpService.get).toHaveBeenCalledWith("/auth/user");
    });
  });

  describe("sendOtp", () => {
    it("calls httpService.post with correct url and data", async () => {
      const data = {
        email: "test@test.com",
        purpose: OtpPurpose.EMAIL_VERIFICATION,
      };
      vi.mocked(httpService.post).mockResolvedValue({ message: "OTP sent" });

      await authService.sendOtp(data);

      expect(httpService.post).toHaveBeenCalledWith("/auth/send-otp", data);
    });
  });

  describe("logout", () => {
    it("calls httpService.delete with correct url", async () => {
      vi.mocked(httpService.delete).mockResolvedValue(undefined);

      await authService.logout();

      expect(httpService.delete).toHaveBeenCalledWith("/auth/logout");
    });
  });

  describe("deleteAccount", () => {
    it("calls httpService.delete with correct url", async () => {
      vi.mocked(httpService.delete).mockResolvedValue(undefined);

      await authService.deleteAccount();

      expect(httpService.delete).toHaveBeenCalledWith("/auth/user");
    });
  });

  describe("updateUser", () => {
    it("calls httpService.patch with correct url and data", async () => {
      const data = { name: "John Updated" };
      vi.mocked(httpService.patch).mockResolvedValue(undefined);

      await authService.updateUser(data);

      expect(httpService.patch).toHaveBeenCalledWith("/auth/user", data);
    });
  });

  describe("forgotPassword", () => {
    it("calls httpService.post with correct url and data", async () => {
      const data = { email: "test@test.com" };
      vi.mocked(httpService.post).mockResolvedValue({ message: "Email sent" });

      await authService.forgotPassword(data);

      expect(httpService.post).toHaveBeenCalledWith(
        "/auth/forgot-password",
        data,
      );
    });
  });

  describe("verifyResetPassword", () => {
    it("calls httpService.post with correct url and data", async () => {
      const data = { code: "1234", email: "test@test.com" };
      vi.mocked(httpService.post).mockResolvedValue({
        resetToken: "reset-token",
      });

      await authService.verifyResetPassword(data);

      expect(httpService.post).toHaveBeenCalledWith(
        "/auth/verify-reset-password",
        data,
      );
    });
  });

  describe("resetPassword", () => {
    it("calls httpService.post with correct url and data", async () => {
      const data = {
        password: "newPassword123",
        email: "test@test.com",
        token: "reset-token",
      };
      vi.mocked(httpService.post).mockResolvedValue(undefined);

      await authService.resetPassword(data);

      expect(httpService.post).toHaveBeenCalledWith(
        "/auth/reset-password",
        data,
      );
    });
  });

  describe("changePassword", () => {
    it("calls httpService.post with correct url and data", async () => {
      const data = { oldPassword: "old123", password: "new123" };
      vi.mocked(httpService.post).mockResolvedValue(undefined);

      await authService.changePassword(data);

      expect(httpService.post).toHaveBeenCalledWith(
        "/auth/change-password",
        data,
      );
    });
  });
});
