import type { OtpPurpose } from "@/const";

export type SendOtpRequest = {
  email: string;
  purpose: OtpPurpose;
};
