import type { SignUpValidationSchemaType } from "@/pages/signup/validation/sign-up.validation-schema";
import type { LoginValidationSchemaType } from "../pages/login/validation/login.validation-schema";
import { httpService } from "./http.service";
import type { AuthResponse } from "@/types/auth-response.type";
import type { EmailVerificationValidationSchemaType } from "@/pages/email-verification/validation/email-verfication.validation-schema";
import type { User } from "@/types/user.type";

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
}

export const authService = new AuthService();
