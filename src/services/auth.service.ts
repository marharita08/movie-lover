import type { EmailVerificationValidationSchemaType } from "@/pages/email-verification/validation/email-verfication.validation-schema";
import type { SignUpValidationSchemaType } from "@/pages/signup/validation/sign-up.validation-schema";
import type { UpdateUserValidationSchemaType } from "@/pages/user-profile/validation/update-user.validation-schema";
import type { AuthResponse } from "@/types/auth-response.type";
import type { SendOtpRequest } from "@/types/send-otp-request";
import type { User } from "@/types/user.type";

import type { LoginValidationSchemaType } from "../pages/login/validation/login.validation-schema";
import { httpService } from "./http.service";

class AuthService {
  async login(data: LoginValidationSchemaType): Promise<AuthResponse> {
    return await httpService.post<AuthResponse, LoginValidationSchemaType>(
      "/auth/login",
      data,
    );
  }

  async signup(data: SignUpValidationSchemaType): Promise<{ message: string }> {
    return await httpService.post<
      { message: string },
      SignUpValidationSchemaType
    >("/auth/signup", data);
  }

  async verifyEmail(
    data: EmailVerificationValidationSchemaType,
  ): Promise<AuthResponse> {
    return await httpService.post<
      AuthResponse,
      EmailVerificationValidationSchemaType
    >("/auth/verify-email", data);
  }

  async getCurrentUser(): Promise<User> {
    return await httpService.get<User>("/auth/user");
  }

  async sendOtp(data: SendOtpRequest): Promise<{ message: string }> {
    return await httpService.post<{ message: string }, SendOtpRequest>(
      "/auth/send-otp",
      data,
    );
  }

  async logout(): Promise<void> {
    return await httpService.delete("/auth/logout");
  }

  async deleteAccount(): Promise<void> {
    return await httpService.delete("/auth/user");
  }

  async updateUser(
    id: string,
    data: UpdateUserValidationSchemaType,
  ): Promise<void> {
    return await httpService.patch(`/auth/user/${id}`, data);
  }
}

export const authService = new AuthService();
