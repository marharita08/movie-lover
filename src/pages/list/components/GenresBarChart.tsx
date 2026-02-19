import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TickItem } from "recharts/types/util/types";

interface GenresBarChartProps {
  data: { genre: string; amount: number }[];
}

interface CustomTickProps {
  x?: number;
  y?: number;
  payload?: TickItem;
}

const CustomTick: React.FC<CustomTickProps> = (props) => {
  const { x, y, payload } = props;

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        transform="rotate(-45)"
        textAnchor="end"
        dy={10}
        fill="#666"
        className="text-xs md:text-base"
      >
        {payload?.value ?? "Unknown"}
      </text>
    </g>
  );
};

export const GenresBarChart: React.FC<GenresBarChartProps> = ({ data }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    let timeoutId: number;
    const check = () => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(
        () => setIsMobile(window.innerWidth < 768),
        100,
      );
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div className="w-full pl-1 md:w-[700px] md:pl-0">
      <h3 className="text-center font-semibold">Amount of movies by genre</h3>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: isMobile ? 0 : 20,
            bottom: isMobile ? 5 : 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="genre"
            interval={0}
            height={isMobile ? 60 : 100}
            tick={<CustomTick />}
            label={
              isMobile
                ? undefined
                : {
                    value: "Genre",
                    position: "bottom",
                    offset: -20,
                    fontWeight: "bold",
                  }
            }
          />
          <YAxis
            width={isMobile ? 30 : 60}
            label={
              isMobile
                ? undefined
                : {
                    value: "Movies amount",
                    position: "insideLeft",
                    style: { textAnchor: "middle" },
                    angle: -90,
                    fontWeight: "bold",
                    offset: 15,
                  }
            }
          />
          <Tooltip />
          <Bar dataKey="amount" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
