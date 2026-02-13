import type { EmailVerificationValidationSchemaType } from "@/pages/email-verification";
import type { LoginValidationSchemaType } from "@/pages/login";
import type {
  EmailStepValidationSchemaType,
  NewPasswordStepValidationSchemaType,
  OtpStepValidationSchemaType,
} from "@/pages/reset-password";
import type { SignUpValidationSchemaType } from "@/pages/signup";
import type {
  ChangePasswordValidationSchemaType,
  UpdateUserValidationSchemaType,
} from "@/pages/user-profile";
import type {
  AuthResponse,
  MessageResponse,
  ResetPasswordVerifyResponse,
  SendOtpRequest,
  User,
} from "@/types";

import { httpService } from "./http.service";

class AuthService {
  async login(data: LoginValidationSchemaType): Promise<AuthResponse> {
    return httpService.post<AuthResponse, LoginValidationSchemaType>(
      "/auth/login",
      data,
    );
  }

  async signup(data: SignUpValidationSchemaType): Promise<MessageResponse> {
    return httpService.post<MessageResponse, SignUpValidationSchemaType>(
      "/auth/signup",
      data,
    );
  }

  async verifyEmail(
    data: EmailVerificationValidationSchemaType,
  ): Promise<AuthResponse> {
    return httpService.post<
      AuthResponse,
      EmailVerificationValidationSchemaType
    >("/auth/verify-email", data);
  }

  async getCurrentUser(): Promise<User> {
    return httpService.get<User>("/auth/user");
  }

  async sendOtp(data: SendOtpRequest): Promise<MessageResponse> {
    return httpService.post<MessageResponse, SendOtpRequest>(
      "/auth/send-otp",
      data,
    );
  }

  async logout(): Promise<void> {
    return httpService.delete("/auth/logout");
  }

  async deleteAccount(): Promise<void> {
    return httpService.delete("/auth/user");
  }

  async updateUser(
    id: string,
    data: UpdateUserValidationSchemaType,
  ): Promise<void> {
    return httpService.patch(`/auth/user/${id}`, data);
  }

  async forgotPassword(
    data: EmailStepValidationSchemaType,
  ): Promise<MessageResponse> {
    return httpService.post<MessageResponse, EmailStepValidationSchemaType>(
      "/auth/forgot-password",
      data,
    );
  }

  async verifyResetPassword(
    data: OtpStepValidationSchemaType,
  ): Promise<ResetPasswordVerifyResponse> {
    return httpService.post<
      ResetPasswordVerifyResponse,
      OtpStepValidationSchemaType
    >("/auth/verify-reset-password", data);
  }

  async resetPassword(
    data: Omit<NewPasswordStepValidationSchemaType, "confirmPassword">,
  ): Promise<void> {
    return httpService.post<
      void,
      Omit<NewPasswordStepValidationSchemaType, "confirmPassword">
    >("/auth/reset-password", data);
  }

  async changePassword(
    data: Omit<ChangePasswordValidationSchemaType, "confirmPassword">,
  ): Promise<void> {
    return httpService.post<
      void,
      Omit<ChangePasswordValidationSchemaType, "confirmPassword">
    >("/auth/change-password", data);
  }
}

export const authService = new AuthService();
