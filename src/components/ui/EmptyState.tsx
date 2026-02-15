import { Film, Popcorn, Video } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: "film" | "popcorn" | "video";
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon = "film",
}) => {
  const IconComponent = {
    film: Film,
    popcorn: Popcorn,
    video: Video,
  }[icon];

  return (
    <div className="flex h-64 flex-col items-center justify-center gap-4 text-center">
      <div className="bg-muted rounded-full p-6">
        <IconComponent className="text-muted-foreground h-12 w-12" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
  );
};
