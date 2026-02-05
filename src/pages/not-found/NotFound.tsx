import { Button } from "@/components/ui/Button";
import { Sphere } from "@/components/ui/Sphere";
import { RouterKey } from "@/const";
import { Link } from "react-router-dom";
import { descriptions } from "./const/descriptions";

const getRandomDescription = () => {
  return descriptions[Math.floor(Math.random() * descriptions.length)];
};

export const NotFound = () => {
  const description = getRandomDescription();

  return (
    <div className="flex justify-center items-center h-screen bg-primary-900 overflow-hidden relative">
      <Sphere className="w-10 h-10 absolute bottom-40 left-50" />
      <Sphere className="w-15 h-15 absolute top-20 left-30" />
      <Sphere className="w-13 h-13 absolute top-28 left-[calc(50%+7.5rem)]" />
      <Sphere className="w-20 h-20 absolute bottom-20 right-40" />
      <div className="bg-card p-8 w-full max-w-[500px] rounded-xl shadow-md">
        <h1 className="text-5xl font-bold mb-6 text-center">404</h1>

        <h2 className="text-xl font-bold mb-2 text-center">Page Not Found</h2>
        <p className="text-center text-muted-foreground">{description}</p>
        <Button className="w-full mt-6" asChild>
          <Link to={RouterKey.DASHBOARD}>Go to Home</Link>
        </Button>
      </div>
    </div>
  );
};
