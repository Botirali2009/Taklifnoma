"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

/** Kategorial ranglar — validatsiyadan o'tgan (blue, orange) */
const SERIES_1 = "#2a78d6";
const SERIES_2 = "#eb6834";
const GRID = "#e7e5e4";
const TEXT = "#52514e";

export type TrendPoint = {
  date: string;
  users: number;
  invitations: number;
};

export type EventTypePoint = {
  label: string;
  count: number;
};

const AXIS = { stroke: GRID, tick: { fill: TEXT, fontSize: 12 } };

const TOOLTIP_STYLE = {
  contentStyle: {
    borderRadius: 12,
    border: "1px solid #e7e5e4",
    fontSize: 13,
  },
};

export function TrendChart({ data }: { data: TrendPoint[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
          <CartesianGrid stroke={GRID} vertical={false} />
          <XAxis dataKey="date" {...AXIS} tickMargin={8} minTickGap={24} />
          <YAxis allowDecimals={false} {...AXIS} width={40} />
          <Tooltip {...TOOLTIP_STYLE} />
          {/* Matn seriya rangini emas, oddiy matn rangini kiyadi */}
          <Legend
            wrapperStyle={{ fontSize: 13 }}
            formatter={(value: string) => (
              <span style={{ color: TEXT }}>{value}</span>
            )}
          />
          <Line
            type="monotone"
            dataKey="users"
            name="Ro'yxatdan o'tganlar"
            stroke={SERIES_1}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="invitations"
            name="Yaratilgan taklifnomalar"
            stroke={SERIES_2}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function EventTypeChart({ data }: { data: EventTypePoint[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 16, right: 8, bottom: 0, left: -20 }}>
          <CartesianGrid stroke={GRID} vertical={false} />
          <XAxis dataKey="label" {...AXIS} tickMargin={8} />
          <YAxis allowDecimals={false} {...AXIS} width={40} />
          <Tooltip {...TOOLTIP_STYLE} cursor={{ fill: "#f5f5f4" }} />
          <Bar
            dataKey="count"
            name="Taklifnomalar"
            fill={SERIES_1}
            radius={[4, 4, 0, 0]}
            maxBarSize={64}
            label={{ position: "top", fill: TEXT, fontSize: 12 }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
