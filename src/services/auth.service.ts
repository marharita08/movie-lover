import type { LoginValidationSchemaType } from "../pages/login/validation/login.validation-schema";
import { httpService } from "./http.service";

class AuthService {
  async login(data: LoginValidationSchemaType): Promise<void> {
    return await httpService.post<void, LoginValidationSchemaType>(
      "/auth/login",
      data,
    );
  }
}

export const authService = new AuthService();
