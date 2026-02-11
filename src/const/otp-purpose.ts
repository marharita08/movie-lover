export const OtpPurpose = {
  EMAIL_VERIFICATION: "EMAIL_VERIFICATION",
  PASSWORD_RESET: "PASSWORD_RESET",
} as const;

export type OtpPurpose = (typeof OtpPurpose)[keyof typeof OtpPurpose];
