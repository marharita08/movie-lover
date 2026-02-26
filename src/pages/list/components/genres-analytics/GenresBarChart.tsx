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

import { CustomTick } from "../custom-tick/CustomTick";

interface GenresBarChartProps {
  data: { genre: string; amount: number }[];
}

export const GenresBarChart: React.FC<GenresBarChartProps> = ({ data }) => {
  const isMobile = useIsMobile();

  return (
    <div className="w-full pl-1 md:w-[700px] md:pl-0 xl:w-full">
      <ResponsiveContainer width="100%" height={400}>
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
            interval={data.length > 25 ? 1 : 0}
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
                    value: "Amount",
                    position: "insideLeft",
                    style: { textAnchor: "middle" },
                    angle: -90,
                    fontWeight: "bold",
                    offset: 15,
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
