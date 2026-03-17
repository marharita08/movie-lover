interface HowItWorksCardProps {
  step: number;
  title: string;
  description: string | React.ReactNode;
}

export const HowItWorksCard: React.FC<HowItWorksCardProps> = ({
  step,
  title,
  description,
}) => {
  return (
    <div className="bg-card h-full rounded-md p-4 shadow-md">
      <p className="mb-1 text-sm font-medium">Step {step}</p>
      <p className="font-semibold">{title}</p>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
};
