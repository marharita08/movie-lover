import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useIsMobile } from "@/hooks";

interface RatingBarChartProps {
  data: { rating: string; amount: number }[];
}

export const RatingBarChart: React.FC<RatingBarChartProps> = ({ data }) => {
  const isMobile = useIsMobile();

  return (
    <div className="w-full md:w-[700px]">
      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: isMobile ? 0 : 20,
            bottom: isMobile ? 5 : 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="rating"
            label={
              isMobile
                ? undefined
                : {
                    value: "Rating",
                    position: "insideBottom",
                    offset: -5,
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
                    value: "Amount",
                    angle: -90,
                    position: "insideLeft",
                    fontWeight: "bold",
                  }
            }
          />
          <Tooltip />
          <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
