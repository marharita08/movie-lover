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

import { CustomTick } from "../genres-analytics/GenresBarChart";

interface YearsBarChartProps {
  data: { year: string; amount: number }[];
}

export const YearsBarChart: React.FC<YearsBarChartProps> = ({ data }) => {
  const isMobile = useIsMobile();

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
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
            dataKey="year"
            tick={<CustomTick />}
            interval={data.length > 25 ? 1 : 0}
            height={isMobile ? 30 : 50}
            label={
              isMobile
                ? undefined
                : {
                    value: "Year",
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
          <Bar dataKey="amount" fill="#8884d8" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
