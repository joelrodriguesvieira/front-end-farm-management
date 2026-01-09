"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { mockSensorsHistory } from "@/src/mocks/sensors";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";

export function TemperatureChart() {
  const chartData = mockSensorsHistory.map((sensor) => {
    const date = new Date(sensor.lastSeen);
    const timeString = date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return {
      time: timeString,
      temperature: sensor.temperature,
      humidity: sensor.humidity,
    };
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Histórico de Temperatura</CardTitle>
        <CardDescription>
          Últimas leituras de temperatura e umidade
        </CardDescription>
      </CardHeader>
      <div className="p-6 pt-0">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              stroke="#888888"
              style={{ fontSize: "12px" }}
            />
            <YAxis
              stroke="#888888"
              style={{ fontSize: "12px" }}
              domain={[15, 30]}
              label={{
                value: "Temperatura (°C)",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid #374151",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#f3f4f6" }}
              formatter={(value) => {
                if (typeof value === "number") {
                  return [`${value.toFixed(1)}`, ""];
                }
                return value;
              }}
            />
            <Legend wrapperStyle={{ fontSize: "12px" }} iconType="line" />
            <Line
              type="monotone"
              dataKey="temperature"
              stroke="#ef4444"
              dot={{ fill: "#ef4444", r: 4 }}
              activeDot={{ r: 6 }}
              strokeWidth={2}
              name="Temperatura (°C)"
            />
            <Line
              type="monotone"
              dataKey="humidity"
              stroke="#3b82f6"
              dot={{ fill: "#3b82f6", r: 4 }}
              activeDot={{ r: 6 }}
              strokeWidth={2}
              name="Umidade (%)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
