"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Label } from "@/src/components/ui/label";
import { Droplet, Lock, Unlock } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { ActionsTable } from "@/src/components/shared/actions-table";
import { Progress } from "@/src/components/ui/progress";
import { Switch } from "@/src/components/ui/switch";

const waterHistoryMock = [
  { id: "1", user: "Joel", amount: "500ml", time: "08:10" },
  { id: "2", user: "Henrique", amount: "300ml", time: "12:00" },
  { id: "3", user: "Sistema", amount: "400ml", time: "18:20" },
];

const waterChartMock = [
  { time: "08h", level: 80 },
  { time: "10h", level: 65 },
  { time: "12h", level: 50 },
  { time: "14h", level: 45 },
  { time: "16h", level: 30 },
];

export default function WaterPage() {
  const [waterLevel, setWaterLevel] = useState(45);
  const [blocked, setBlocked] = useState(false);
  const [loading, setLoading] = useState(false);

  const getStatus = () => {
    if (waterLevel > 50) return "Normal";
    if (waterLevel > 20) return "Atenção";
    return "Crítico";
  };

  const handleReleaseWater = () => {
    setLoading(true);

    setTimeout(() => {
      setWaterLevel((prev) => Math.max(prev - 10, 0));
      setLoading(false);
    }, 800);
  };

  const isDisabled =
    blocked || waterLevel <= 0 || getStatus() === "Crítico";

  return (
    <div className="flex flex-col min-h-[calc(100vh-2rem)] gap-6 px-4 md:px-8 py-4 pb-10 w-full lg:max-w-5xl">
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold">Água</h1>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Card>
            <CardHeader className="px-6">
              <CardDescription>Nível atual</CardDescription>
              <CardTitle className="text-2xl tabular-nums">
                {waterLevel}%
              </CardTitle>

              <Progress value={waterLevel} className="mt-4 h-3" />
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="px-6">
              <CardDescription>Status do sistema</CardDescription>
              <CardTitle
                className={`text-2xl ${
                  getStatus() === "Crítico"
                    ? "text-red-500"
                    : getStatus() === "Atenção"
                    ? "text-yellow-500"
                    : "text-green-500"
                }`}
              >
                {getStatus()}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Histórico de nível de água
            </CardTitle>
          </CardHeader>

          <div className="h-[220px] px-4 pb-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={waterChartMock}>
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="level"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="overflow-x-auto">
          <ActionsTable
            title="Histórico de Liberação de Água"
            columns={[
              { accessorKey: "user", header: "Usuário" },
              { accessorKey: "amount", header: "Quantidade" },
              { accessorKey: "time", header: "Horário" },
            ]}
            data={waterHistoryMock}
          />
        </div>
      </div>

      <div className="flex-1" />

      <div className="flex flex-col gap-4 pb-6 md:pb-12 mt-4">
        <div className="flex items-center justify-between px-1">
          <Label className="flex items-center gap-2">
            {blocked ? <Lock size={16} /> : <Unlock size={16} />}
            Sistema bloqueado
          </Label>
          <Switch checked={blocked} onCheckedChange={setBlocked} />
        </div>

        <Button
          onClick={handleReleaseWater}
          disabled={isDisabled || loading}
          className="cursor-pointer w-full h-12 text-base"
        >
          Liberar Água
          <Droplet className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
