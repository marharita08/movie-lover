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

interface CompaniesBarChartProps {
  data: { company: string; amount: number }[];
}

export const CompaniesBarChart: React.FC<CompaniesBarChartProps> = ({
  data,
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="w-full pl-1 md:pl-0">
      <ResponsiveContainer width="100%" height={500}>
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
            dataKey="company"
            interval={data.length > 25 ? 1 : 0}
            height={isMobile ? 125 : 150}
            tick={<CustomTick className="md:text-xs" />}
            label={
              isMobile
                ? undefined
                : {
                    value: "Production company",
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
