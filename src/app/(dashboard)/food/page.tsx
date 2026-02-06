"use client";

import { useState, useMemo, useEffect } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Label } from "@/src/components/ui/label";
import { Input } from "@/src/components/ui/input";
import { Sliders } from "lucide-react";
import { useSensor, useSensorHistory, useConfig } from "@/src/hooks/useApi";
import { Skeleton } from "@/src/components/ui/skeleton";
import { apiService } from "@/src/lib/api";

export default function FoodPage() {
  const { sensor, loading: sensorLoading, error: sensorError } = useSensor();
  const { history, loading: historyLoading } = useSensorHistory(10);
  const { error: configError } = useConfig();

  const [limitsOpen, setLimitsOpen] = useState(false);
  const [minWeight, setMinWeight] = useState<number>(100);
  const [maxWeight, setMaxWeight] = useState<number>(500);
  const [savingLimits, setSavingLimits] = useState(false);
  const [limitError, setLimitError] = useState<string | null>(null);

  const foodWeight = sensor?.rationWeight || 0;

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

  const handleSaveLimits = async () => {
    try {
      setSavingLimits(true);
      setLimitError(null);
      
      await apiService.updateConfig({
        ration: {
          minWeight,
          maxWeight,
        },
      });
      
      setLimitsOpen(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao salvar limites";
      setLimitError(message);
    } finally {
      setSavingLimits(false);
    }
  };

  const foodChartData = history
    .slice()
    .reverse()
    .map((h) => {
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

  return (
    <div className="flex flex-col min-h-[calc(100vh-2rem)] gap-6 px-4 md:px-8 py-4 pb-10 w-full lg:max-w-5xl">
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold">Alimentação</h1>

        {(sensorError || configError) && (
          <div className="p-4 bg-red-50 border border-red-200 rounded text-sm text-red-600">
            {sensorError && <p>❌ Erro ao carregar dados de sensor: {sensorError.message}</p>}
            {configError && <p>❌ Erro ao carregar configurações: {configError.message}</p>}
          </div>
        )}

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
      </div>

      <div className="flex flex-col gap-6 pb-6 md:pb-12 mt-4">
        <Dialog open={limitsOpen} onOpenChange={setLimitsOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary" className="w-full h-12">
              Definir limites de comida
              <Sliders className="ml-2 h-5 w-5" />
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[400px] w-[90%] rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-center">
                Configurar limites de alimentação
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="min-weight">Peso mínimo (g)</Label>
                <Input
                  id="min-weight"
                  type="number"
                  value={minWeight}
                  onChange={(e) => setMinWeight(Number(e.target.value))}
                  className="h-12"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="max-weight">Peso máximo (g)</Label>
                <Input
                  id="max-weight"
                  type="number"
                  value={maxWeight}
                  onChange={(e) => setMaxWeight(Number(e.target.value))}
                  className="h-12"
                />
              </div>

              {limitError && (
                <div className="p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
                  {limitError}
                </div>
              )}

              <Button
                className="w-full h-12"
                onClick={handleSaveLimits}
                disabled={savingLimits}
              >
                {savingLimits ? "Salvando..." : "Salvar limites"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
