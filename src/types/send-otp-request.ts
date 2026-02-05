import type { OtpPurpose } from "@/const/otp-purpose";

export type SendOtpRequest = {
  email: string;
  purpose: OtpPurpose;
};
