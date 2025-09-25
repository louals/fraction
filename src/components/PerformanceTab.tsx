// src/components/PerformanceTab.tsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

// Props type: performance history with year/value pairs
type PerformanceProps = {
  history: { year: number; value: number }[];
};

// Helper: format numbers into US currency style without decimals
const currency = (n: number) =>
  '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 });

// Predefined tick values for Y and X axis
const yTicks = [800000, 850000, 900000, 950000, 1000000, 1050000, 1100000];
const xTicks = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];

// Component: renders performance chart and related sections
export default function PerformanceTab({ history }: PerformanceProps) {
  return (
    <div className="space-y-8">
      {/* Title section */}
      <div className="space-y-1">
        <h3 className="text-[18px] font-bold text-fraction-violet-500">
          Historical Appreciation Rate
        </h3>
        <p className="text-[13px] text-fraction-blue-300">
          How much has the property value increased over the past years?
        </p>
      </div>

      {/* Chart container */}
      <div className="h-[320px] w-full rounded-2xl border border-fraction-gray-500 bg-white shadow-sm">
        <div className="h-full w-full p-4">
          <ResponsiveContainer>
            <LineChart
              data={history}
              margin={{ top: 10, right: 20, bottom: 10, left: 0 }}
            >
              {/* Grid lines */}
              <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" />

              {/* X axis: years */}
              <XAxis
                dataKey="year"
                ticks={xTicks}
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                axisLine={{ stroke: '#E5E7EB' }}
                tickLine={false}
              />

              {/* Y axis: values formatted as currency */}
              <YAxis
                domain={[800000, 1100000]}
                ticks={yTicks}
                tickFormatter={currency}
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                axisLine={{ stroke: '#E5E7EB' }}
                tickLine={false}
                width={72}
              />

              {/* Tooltip for interactive hover values */}
              <Tooltip
                formatter={(v: any) => currency(Number(v))}
                labelFormatter={(label) => `Year: ${label}`}
                contentStyle={{
                  borderRadius: 10,
                  borderColor: '#E5E7EB',
                  boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
                }}
              />

              {/* Line chart path */}
              <Line
                type="monotone"
                dataKey="value"
                stroke="#6366F1"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Informational static sections */}
      <div className="space-y-14">
        <section>
          <h4 className="text-[13px] font-semibold text-black">
            Projected Future Growth
          </h4>
          <p className="text-[12px] leading-5 text-black">
            Expected appreciation based on market trends and location analysis.
          </p>
        </section>

        <section>
          <h4 className="text-[13px] font-semibold text-black">
            Comparable Market Data
          </h4>
          <p className="text-[12px] leading-5 text-black">
            How does this property compare to similar ones in the area?
          </p>
        </section>

        <section>
          <h4 className="text-[13px] font-semibold text-black">
            Risk Assessment &amp; Stability
          </h4>
        </section>
      </div>
    </div>
  );
}
