import { cn } from "@/utils/cn";

interface SphereProps {
  className?: string;
}
export const Sphere: React.FC<SphereProps> = ({ className }) => {
  return (
    <div
      className={cn(
        "rounded-full bg-[linear-gradient(45deg,var(--sphere-dark),var(--sphere-medium),var(--sphere-light))] hidden md:block",
        className,
      )}
    />
  );
};
