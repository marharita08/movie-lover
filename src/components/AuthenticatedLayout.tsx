import { cn } from "@/utils/cn";

import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

type AuthenticatedLayoutProps = {
  children: React.ReactNode;
  className?: string;
};

export const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({
  children,
  className,
}) => {
  return (
    <div>
      <Header />
      <Sidebar />
      <div className={cn("pt-22 pl-14", className)}>{children}</div>
    </div>
  );
};
