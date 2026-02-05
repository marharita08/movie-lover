import { LoadingOverlay } from "@/components/ui/Loading";
import { RouterKey, StorageKey } from "@/const";
import { OtpPurpose } from "@/const/otp-purpose";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useSendOtp } from "@/hooks/useSendOtp";
import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";

type AuthGuardProps = {
  children: React.ReactNode;
};

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { data: user, isLoading } = useCurrentUser();
  const navigate = useNavigate();
  const sendOtpMutation = useSendOtp();

  useEffect(() => {
    if (!isLoading && user && !user.isEmailVerified) {
      sendOtpMutation.mutate(
        {
          email: user.email,
          purpose: OtpPurpose.EMAIL_VERIFICATION,
        },
        {
          onSuccess: () => {
            localStorage.setItem(StorageKey.EMAIL, user.email);
            navigate(RouterKey.EMAIL_VERIFICATION);
          },
          onError: () => {
            navigate(RouterKey.LOGIN);
          },
        },
      );
    }
  }, [isLoading, user, sendOtpMutation, navigate]);

  if (isLoading) {
    return <LoadingOverlay />;
  }

  if (!user) {
    return <Navigate to={RouterKey.LOGIN} />;
  }

  return children;
};
