import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  TooltipPayload,
} from "recharts";

interface ChartData {
  eventType: string;
  riskScore: number;
  count: number;
}

interface FraudAndRiskDetectionChartProps {
  data: ChartData[];
}

const EVENT_TYPES_ORDER: { key: string; label: string }[] = [
  { key: "failed_login", label: "Failed Login" },
  { key: "multiple_time_failed_login", label: "Multiple Failed Logins" },
  { key: "unapproved_login_attempt", label: "Unapproved Login" },
  { key: "suspicious_email", label: "Suspicious Email" },
  { key: "abnormal_pattern", label: "Abnormal Pattern" },
  { key: "multiple_withdraw_attempts", label: "Multiple Withdrawals" },
  { key: "other", label: "Other" },
];

const formatNumber = (v: number) => (Number.isFinite(v) ? v : 0);

export const FraudAndRiskDetectionChart = ({ data }: FraudAndRiskDetectionChartProps) => {
  // Build map from incoming data
  const map: Record<string, { count: number; riskScore: number }> = {};
  (data || []).forEach((d) => {
    map[d.eventType] = { count: formatNumber(d.count), riskScore: formatNumber(d.riskScore) };
  });

  // Ensure all expected event types are present and ordered
  const chartData = EVENT_TYPES_ORDER.map((et) => ({
    eventType: et.key,
    displayName: et.label,
    count: map[et.key]?.count ?? 0,
    riskScore: map[et.key]?.riskScore ?? 0,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={chartData} margin={{ top: 10, right: 40, left: 60, bottom: 100 }}>
        <defs>
          <linearGradient id="countGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ec4899" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#ec4899" stopOpacity={0.25} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="displayName" angle={-45} textAnchor="end" interval={0} height={100} />
        <YAxis yAxisId="left" label={{ value: "Event Count", angle: -90, position: "insideLeft" }} />
        <YAxis yAxisId="right" orientation="right" label={{ value: "Risk Score", angle: 90, position: "insideRight" }} />
        <Tooltip
          formatter={(value: any, name: string) => [value, name === "count" ? "Count" : "Risk Score"]}
          labelFormatter={(label: string) => `${label}`}
        />
        <Legend verticalAlign="top" />

        <Bar yAxisId="left" dataKey="count" name="Event Count" fill="url(#countGradient)" barSize={32} />
        <Line yAxisId="right" type="monotone" dataKey="riskScore" name="Risk Score" stroke="#6b4f2f" strokeWidth={3} dot={{ r: 4 }} />
      </ComposedChart>
    </ResponsiveContainer>
  );
};
