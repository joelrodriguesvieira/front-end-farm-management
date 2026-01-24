"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/src/components/ui/card";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Droplets } from "lucide-react";
import { useState } from "react";

const waterHistoryMock = [
  { time: "08h", level: 1 },
  { time: "10h", level: 1 },
  { time: "12h", level: 0 },
  { time: "14h", level: 0 },
  { time: "16h", level: 1 },
];

export default function WaterPage() {
  const [value, setValue] = useState(true);

  return (
    <div className="flex flex-col gap-6 px-4 md:px-8 py-4 w-full lg:max-w-5xl">
      <h1 className="text-2xl font-semibold">Água</h1>

      <Card>
        <CardHeader className="px-6">
          <CardDescription>Status do reservatório</CardDescription>
          <CardTitle
            className={`text-2xl flex items-center gap-2 ${
              value ? "text-green-500" : "text-red-500"
            }`}
          >
            <Droplets className="h-6 w-6" />
            {value ? "Nível Alto" : "Nível Baixo"}
          </CardTitle>
        </CardHeader>
      </Card>

      {/* HISTÓRICO */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Histórico de leituras do sensor
          </CardTitle>
        </CardHeader>

        <div className="h-[220px] px-4 pb-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={waterHistoryMock}>
              <XAxis dataKey="time" />
              <YAxis
                ticks={[0, 1]}
                tickFormatter={(v) => (v === 1 ? "Alto" : "Baixo")}
              />

              <Tooltip
                formatter={(value) =>
                  value === 1 ? "Nível Alto" : "Nível Baixo"
                }
              />

              <Line type="stepAfter" dataKey="level" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
