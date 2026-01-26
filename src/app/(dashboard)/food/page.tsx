"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/src/components/ui/card";
import { Progress } from "@/src/components/ui/progress";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { ActionsTable } from "@/src/components/shared/actions-table";
import { useSensor, useSensorHistory, useActions, useConfig } from "@/src/hooks/useApi";
import { useMemo } from "react";
import { Skeleton } from "@/src/components/ui/skeleton";

export default function FoodPage() {
  const { sensor, loading: sensorLoading } = useSensor();
  const { history, loading: historyLoading } = useSensorHistory(10);
  const { actions } = useActions();
  const { config } = useConfig();

  const foodWeight = sensor?.rationWeight || 0;
  const minWeight = config?.ration?.minWeight || 100;
  const maxWeight = config?.ration?.maxWeight || 500;

  const foodPercentage = useMemo(() => {
    return Math.max(
      0,
      Math.min(
        ((foodWeight - minWeight) / (maxWeight - minWeight)) * 100,
        100,
      ),
    );
  }, [foodWeight, minWeight, maxWeight]);

  const getStatus = () => {
    if (foodPercentage > 60) return "Abastecido";
    if (foodPercentage >= 30) return "Atenção";
    return "Baixo";
  };

  const foodChartData = history.map((h) => {
    const date = new Date(h.createdAt);
    const timeString = date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const percent = Math.max(0, Math.min(((h.rationWeight - minWeight) / (maxWeight - minWeight)) * 100, 100));
    return {
      time: timeString,
      level: Math.round(percent),
    };
  });

  const foodHistoryData = actions
    .filter((a) => a.system === "ration")
    .slice(0, 10)
    .map((action) => {
      const date = new Date(action.createdAt);
      const timeString = date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });
      return {
        id: action.id.toString(),
        user: "Sistema",
        quantity: action.quantity ? `${action.quantity}g` : "—",
        dateTime: timeString,
      };
    });

  return (
    <div className="flex flex-col min-h-[calc(100vh-2rem)] gap-6 px-4 md:px-8 py-4 pb-10 w-full lg:max-w-5xl">
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold">Alimentação</h1>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <Card>
            <CardHeader className="px-6">
              <CardDescription>Quantidade atual</CardDescription>
              <CardTitle className="text-2xl tabular-nums">
                {sensorLoading ? <Skeleton className="h-8 w-12" /> : `${Math.round(foodPercentage)}%`}
              </CardTitle>
              <Progress value={foodPercentage} className="mt-4 h-3" />
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="px-6">
              <CardDescription>Status do estoque</CardDescription>
              <CardTitle
                className={`text-2xl ${
                  getStatus() === "Baixo"
                    ? "text-red-500"
                    : getStatus() === "Atenção"
                      ? "text-yellow-500"
                      : "text-green-500"
                }`}
              >
                {sensorLoading ? <Skeleton className="h-8 w-16" /> : getStatus()}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="px-6">
              <CardDescription>Peso atual</CardDescription>
              <CardTitle className="text-2xl">
                {sensorLoading ? <Skeleton className="h-8 w-16" /> : `${Math.round(foodWeight)}g`}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Histórico do nível</CardTitle>
          </CardHeader>

          <div className="h-[220px] px-4 pb-4">
            {historyLoading ? (
              <Skeleton className="w-full h-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={foodChartData}>
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="level" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        <div className="overflow-x-auto">
          <ActionsTable
            columns={[
              { accessorKey: "user", header: "Usuário" },
              { accessorKey: "quantity", header: "Quantidade" },
              { accessorKey: "dateTime", header: "Horário" },
            ]}
            data={foodHistoryData}
            title="Histórico de Alimentação"
          />
        </div>
      </div>
    </div>
  );
}
