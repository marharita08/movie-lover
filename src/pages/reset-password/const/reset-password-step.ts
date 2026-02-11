export const ResetPasswordStep = {
  EMAIL: "EMAIL",
  OTP: "OTP",
  NEW_PASSWORD: "NEW_PASSWORD",
} as const;

export type ResetPasswordStep =
  (typeof ResetPasswordStep)[keyof typeof ResetPasswordStep];
