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
import { useSensor, useSensorHistory } from "@/src/hooks/useApi";
import { Skeleton } from "@/src/components/ui/skeleton";

export default function WaterPage() {
  const { sensor, loading: sensorLoading } = useSensor();
  const { history, loading: historyLoading } = useSensorHistory(10);

  const waterHistoryData = history
    .slice()
    .reverse()
    .map((h) => {
      const date = new Date(h.createdAt);
      const timeString = date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });
      return {
        time: timeString,
        level: h.waterLevel ? 1 : 0,
      };
    });

  const waterStatus = sensor?.waterLevel ? "Nível Alto" : "Nível Baixo";
  const waterStatusColor = sensor?.waterLevel ? "text-green-500" : "text-red-500";

  return (
    <div className="flex flex-col gap-6 px-4 md:px-8 py-4 w-full lg:max-w-5xl">
      <h1 className="text-2xl font-semibold">Água</h1>

      <Card>
        <CardHeader className="px-6">
          <CardDescription>Status do reservatório</CardDescription>
          <CardTitle className={`text-2xl flex items-center gap-2 ${waterStatusColor}`}>
            <Droplets className="h-6 w-6" />
            {sensorLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              waterStatus
            )}
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
          {historyLoading ? (
            <Skeleton className="w-full h-full" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={waterHistoryData}>
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
          )}
        </div>
      </Card>
    </div>
  );
}
