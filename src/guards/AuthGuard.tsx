import { LoadingOverlay } from "@/components/ui/Loading";
import { RouterKey } from "@/const";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Navigate } from "react-router-dom";

type AuthGuardProps = {
  children: React.ReactNode;
};

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) {
    return <LoadingOverlay />;
  }

  if (!user) {
    return <Navigate to={RouterKey.LOGIN} />;
  }

  return children;
};
