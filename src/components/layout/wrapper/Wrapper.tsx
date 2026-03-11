import { cn } from "@/utils";

import { Header } from "../header/Header";
import { Sidebar } from "../sidebar/Sidebar";

type WrapperProps = {
  children: React.ReactNode;
  wrapperClassName?: string;
  mainClassName?: string;
};

export const Wrapper: React.FC<WrapperProps> = ({
  children,
  wrapperClassName,
  mainClassName,
}) => {
  return (
    <div className={cn(wrapperClassName)}>
      <Header />
      <Sidebar />
      <main className={cn("pt-22 pl-0 md:pl-14", mainClassName)}>
        {children}
      </main>
    </div>
  );
};
