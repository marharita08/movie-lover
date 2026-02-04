import type { SignUpValidationSchemaType } from "@/pages/signup/validation/sign-up.validation-schema";
import type { LoginValidationSchemaType } from "../pages/login/validation/login.validation-schema";
import { httpService } from "./http.service";
import type { AuthResponse } from "@/types/auth-response.type";

class AuthService {
  async login(data: LoginValidationSchemaType): Promise<AuthResponse> {
    return await httpService.post<AuthResponse, LoginValidationSchemaType>(
      "/auth/login",
      data,
    );
  }

  async signup(data: SignUpValidationSchemaType): Promise<{message: string}> {
    return await httpService.post<{message: string}, SignUpValidationSchemaType>(
      "/auth/signup",
      data,
    );
  }
}

export const authService = new AuthService();
