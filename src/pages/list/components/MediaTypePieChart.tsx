import { Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { type MediaType, mediaTypeToLabel } from "@/const";

interface MediaTypePieChartProps {
  data: {
    name: MediaType;
    value: number;
  }[];
}

export const MediaTypePieChart: React.FC<MediaTypePieChartProps> = ({
  data,
}) => {
  const COLORS = ["#0088FE", "#00C49F"];
  const total = data.reduce((sum, d) => sum + d.value, 0);

  const enrichedData = data.map((d, index) => ({
    ...d,
    total,
    fill: COLORS[index % COLORS.length],
  }));

  return (
    <div className="w-full md:w-[500px]">
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={enrichedData}
            outerRadius={140}
            dataKey="value"
            label={({ name, percent }) =>
              `${mediaTypeToLabel[name as MediaType]} ${percent ? (percent * 100).toFixed(0) : 0}%`
            }
            labelLine={true}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const item = payload[0];
              const { name, value, total } = item.payload as {
                name: MediaType;
                value: number;
                total: number;
              };
              return (
                <div className="bg-card border border-neutral-300 p-2.5 shadow-sm">
                  <p className="mb-1 font-bold">{mediaTypeToLabel[name]}</p>
                  <p>Total: {total}</p>
                  <p>Amount: {value}</p>
                  <p>
                    Percentage: {total ? ((value / total) * 100).toFixed(1) : 0}
                    %
                  </p>
                </div>
              );
            }}
          />
          <Legend
            formatter={(value) => mediaTypeToLabel[value as MediaType] ?? value}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
