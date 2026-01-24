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
import { useMemo } from "react";

/* ---------------- MOCK ---------------- */

// simulando retorno do backend
const foodWeightFromBackend = 400; // em gramas

const MIN_WEIGHT = 100;
const MAX_WEIGHT = 500;

const foodHistoryMock = [
  { id: "1", user: "Joel", quantity: "—", dateTime: "08:00" },
  { id: "2", user: "Joel", quantity: "—", dateTime: "12:00" },
  { id: "3", user: "Joel", quantity: "—", dateTime: "18:00" },
];

const foodChartMock = [
  { time: "08h", level: 90 },
  { time: "10h", level: 75 },
  { time: "12h", level: 60 },
  { time: "14h", level: 45 },
  { time: "16h", level: 30 },
];

export default function FoodPage() {
  const foodPercentage = useMemo(() => {
    return Math.max(
      0,
      Math.min(
        ((foodWeightFromBackend - MIN_WEIGHT) / (MAX_WEIGHT - MIN_WEIGHT)) *
          100,
        100,
      ),
    );
  }, [foodWeightFromBackend]);

  const getStatus = () => {
    if (foodPercentage > 60) return "Abastecido";
    if (foodPercentage >= 30) return "Atenção";
    return "Baixo";
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-2rem)] gap-6 px-4 md:px-8 py-4 pb-10 w-full lg:max-w-5xl">
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold">Alimentação</h1>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <Card>
            <CardHeader className="px-6">
              <CardDescription>Quantidade atual</CardDescription>
              <CardTitle className="text-2xl tabular-nums">
                {Math.round(foodPercentage)}%
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
                {getStatus()}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="px-6">
              <CardDescription>Peso atual</CardDescription>
              <CardTitle className="text-2xl">
                {foodWeightFromBackend}g
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Histórico do nível</CardTitle>
          </CardHeader>

          <div className="h-[220px] px-4 pb-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={foodChartMock}>
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="level" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="overflow-x-auto">
          <ActionsTable
            columns={[
              { accessorKey: "user", header: "Usuário" },
              { accessorKey: "quantity", header: "Quantidade" },
              { accessorKey: "dateTime", header: "Horário" },
            ]}
            data={foodHistoryMock}
            title="Histórico de Alimentação"
          />
        </div>
      </div>
    </div>
  );
}
