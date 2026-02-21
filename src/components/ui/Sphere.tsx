import { cn } from "@/utils";

interface SphereProps {
  className?: string;
}
export const Sphere: React.FC<SphereProps> = ({ className }) => {
  return (
    <div
      className={cn(
        "hidden rounded-full bg-[linear-gradient(45deg,var(--sphere-dark),var(--sphere-medium),var(--sphere-light))] md:block",
        className,
      )}
    />
  );
};
