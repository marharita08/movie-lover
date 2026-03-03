import { cn } from "@/utils";

import { Header } from "../header/Header";
import { Sidebar } from "../sidebar/Sidebar";

type WrapperProps = {
  children: React.ReactNode;
  className?: string;
};

export const Wrapper: React.FC<WrapperProps> = ({ children, className }) => {
  return (
    <div>
      <Header />
      <Sidebar />
      <main className={cn("pt-22 pl-0 md:pl-14", className)}>{children}</main>
    </div>
  );
};
