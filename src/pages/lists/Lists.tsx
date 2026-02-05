import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";

export const Lists = () => {
  return (
    <div className="relative">
      <Sidebar />
      <Header />
      <div className="pl-14">
        <h1>Lists</h1>
      </div>
    </div>
  );
};
