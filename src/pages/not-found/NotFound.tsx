import { Link } from "react-router-dom";

import { Button, Sphere } from "@/components";
import { RouterKey } from "@/const";

import { descriptions } from "./const";

const getRandomDescription = () => {
  return descriptions[Math.floor(Math.random() * descriptions.length)];
};

export const NotFound = () => {
  const description = getRandomDescription();

  return (
    <div className="bg-primary-900 relative flex h-screen items-center justify-center overflow-hidden">
      <Sphere className="absolute bottom-40 left-50 h-10 w-10" />
      <Sphere className="absolute top-20 left-30 h-15 w-15" />
      <Sphere className="absolute top-28 left-[calc(50%+7.5rem)] h-13 w-13" />
      <Sphere className="absolute right-40 bottom-20 h-20 w-20" />
      <div className="bg-card w-full max-w-[500px] rounded-xl p-8 shadow-md">
        <h1 className="mb-6 text-center text-5xl font-bold">404</h1>

        <h2 className="mb-2 text-center text-xl font-bold">Page Not Found</h2>
        <p className="text-muted-foreground text-center">{description}</p>
        <Button className="mt-6 w-full" asChild>
          <Link to={RouterKey.DASHBOARD}>Go to Home</Link>
        </Button>
      </div>
    </div>
  );
};
