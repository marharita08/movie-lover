import type { TickItem } from "recharts/types/util/types";

import { cn } from "@/utils";

interface CustomTickProps {
  x?: number;
  y?: number;
  payload?: TickItem;
  className?: string;
}

export const CustomTick: React.FC<CustomTickProps> = (props) => {
  const { x, y, payload, className } = props;

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        transform="rotate(-45)"
        textAnchor="end"
        dy={10}
        fill="#666"
        className={cn("text-xs md:text-base", className)}
      >
        {payload?.value ?? "Unknown"}
      </text>
    </g>
  );
};
