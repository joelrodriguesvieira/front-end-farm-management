"use client";

import { useState, useEffect } from "react";
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
import { useSensors } from "@/src/hooks/use-sensors";
import { useActions } from "@/src/hooks/use-actions";
import { Action } from "@/src/lib/api";

interface WaterAction {
  id: string;
  user: string;
  amount: string;
  time: string;
}

export default function WaterPage() {
  const { currentData, loading: sensorsLoading, error: sensorsError } = useSensors();
  const { actions: apiActions, create: createAction, loading: actionsLoading } = useActions();
  const [blocked, setBlocked] = useState(false);
  const [waterActions, setWaterActions] = useState<WaterAction[]>([]);
  const [chartData, setChartData] = useState<Array<{ time: string; level: number }>>([]);

  const waterLevel = currentData?.waterLevel ?? 0;

  useEffect(() => {
    if (apiActions && apiActions.length > 0) {
      const mapped: WaterAction[] = apiActions.map((action: Action) => ({
        id: action.id,
        user: action.user?.name || "Sistema",
        amount: `${action.quantity}ml`,
        time: new Date(action.createdAt || "").toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));
      setWaterActions(mapped);
    }
  }, [apiActions]);

  useEffect(() => {
    // Gerar dados de gráfico baseado no nível atual
    const now = new Date();
    const data = [];
    for (let i = 5; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 30 * 60000);
      const hours = time.getHours().toString().padStart(2, "0");
      data.push({
        time: `${hours}h`,
        level: Math.max(waterLevel - (5 - i) * 8, 0),
      });
    }
    setChartData(data);
  }, [waterLevel]);

  const getStatus = () => {
    if (waterLevel > 50) return "Normal";
    if (waterLevel > 20) return "Atenção";
    return "Crítico";
  };

  const handleReleaseWater = async () => {
    try {
      await createAction({
        userId: "user-id", // Será substituído com ID real do usuário autenticado
        system: "water",
        action: "Liberação manual",
        quantity: 500,
      });
    } catch (err) {
      console.error("Erro ao liberar água:", err);
    }
  };

  const isDisabled = blocked || waterLevel <= 0 || getStatus() === "Crítico" || actionsLoading || sensorsLoading;

  if (sensorsLoading && !currentData) {
    return (
      <div className="flex flex-col gap-6 px-4 md:px-8 py-4 w-full">
        <h1 className="text-2xl font-semibold">Água</h1>
        <Card className="animate-pulse">
          <CardHeader>Carregando...</CardHeader>
        </Card>
      </div>
    );
  }

  if (sensorsError) {
    return (
      <div className="flex flex-col gap-6 px-4 md:px-8 py-4 w-full">
        <h1 className="text-2xl font-semibold">Água</h1>
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardDescription className="text-red-700">{sensorsError}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

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
              <LineChart data={chartData}>
                <XAxis dataKey="time" stroke="#888888" style={{ fontSize: "12px" }} />
                <YAxis stroke="#888888" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#f3f4f6" }}
                />
                <Line
                  type="monotone"
                  dataKey="level"
                  stroke="#3b82f6"
                  dot={{ fill: "#3b82f6", r: 4 }}
                  activeDot={{ r: 6 }}
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
            data={waterActions.length > 0 ? waterActions : []}
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
          disabled={isDisabled}
          className="cursor-pointer w-full h-12 text-base"
        >
          {actionsLoading ? "Processando..." : "Liberar Água"}
          <Droplet className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
