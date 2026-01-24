"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Progress } from "@/src/components/ui/progress";
import { Switch } from "@/src/components/ui/switch";
import { Label } from "@/src/components/ui/label";
import { Plus, Lock, Unlock, Wheat } from "lucide-react";
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
import { Input } from "@/src/components/ui/input";
import { ActionsTable } from "@/src/components/shared/actions-table";
import { useSensors } from "@/src/hooks/use-sensors";
import { useActions } from "@/src/hooks/use-actions";
import { Action } from "@/src/lib/api";

interface FoodAction {
  id: string;
  user: string;
  quantity: string;
  dateTime: string;
}

export default function FoodPage() {
  const { currentData, loading: sensorsLoading, error: sensorsError } = useSensors();
  const { actions: apiActions, create: createAction, loading: actionsLoading } = useActions();
  const [quantity, setQuantity] = useState("");
  const [blocked, setBlocked] = useState(false);
  const [autoMode, setAutoMode] = useState(true);
  const [foodActions, setFoodActions] = useState<FoodAction[]>([]);
  const [chartData, setChartData] = useState<Array<{ time: string; level: number }>>([]);

  const foodLevel = currentData?.rationWeight ?? 0;

  useEffect(() => {
    if (apiActions && apiActions.length > 0) {
      const mapped: FoodAction[] = apiActions.map((action: Action) => ({
        id: action.id,
        user: action.user?.name || "Sistema",
        quantity: `${action.quantity}g`,
        dateTime: new Date(action.createdAt || "").toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));
      setFoodActions(mapped);
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
        level: Math.max(100 - (5 - i) * 10, Math.ceil(foodLevel / 50)),
      });
    }
    setChartData(data);
  }, [foodLevel]);

  const getStatus = () => {
    if (foodLevel > 500) return "Normal";
    if (foodLevel > 200) return "Atenção";
    return "Crítico";
  };

  const handleAddFood = async () => {
    if (!quantity) return;
    try {
      await createAction({
        userId: "user-id",
        system: "food",
        action: "Abastecimento",
        quantity: Number(quantity),
      });
      setQuantity("");
    } catch (err) {
      console.error("Erro ao adicionar comida:", err);
    }
  };

  const handleReleaseFood = async () => {
    try {
      await createAction({
        userId: "user-id",
        system: "food",
        action: "Liberação manual",
        quantity: 50,
      });
    } catch (err) {
      console.error("Erro ao liberar comida:", err);
    }
  };

  const isDisabled = blocked || getStatus() === "Crítico";

  if (sensorsLoading && !currentData) {
    return (
      <div className="flex flex-col gap-6 px-4 md:px-8 py-4 w-full">
        <h1 className="text-2xl font-semibold">Alimentação</h1>
        <Card className="animate-pulse">
          <CardHeader>Carregando...</CardHeader>
        </Card>
      </div>
    );
  }

  if (sensorsError) {
    return (
      <div className="flex flex-col gap-6 px-4 md:px-8 py-4 w-full">
        <h1 className="text-2xl font-semibold">Alimentação</h1>
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardDescription className="text-red-700">{sensorsError}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const foodLevelPercent = Math.ceil((foodLevel / 1000) * 100);

  return (
    <div className="flex flex-col min-h-[calc(100vh-2rem)] gap-6 px-4 md:px-8 py-4 pb-10 w-full lg:max-w-5xl">
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold">Alimentação</h1>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <Card>
            <CardHeader className="px-6">
              <CardDescription>Quantidade atual</CardDescription>
              <CardTitle className="text-2xl tabular-nums">
                {foodLevel.toFixed(1)}g
              </CardTitle>
              <Progress value={Math.min(foodLevelPercent, 100)} className="mt-4 h-3" />
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="px-6">
              <CardDescription>Status do estoque</CardDescription>
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

          <Card>
            <CardHeader className="px-6">
              <CardDescription>Previsão</CardDescription>
              <CardTitle className="text-2xl">
                {foodLevel > 300 ? "2+ dias" : foodLevel > 100 ? "1 dia" : "Menos de 1 dia"}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Consumo de comida
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
                  stroke="#f59e0b"
                  dot={{ fill: "#f59e0b", r: 4 }}
                  activeDot={{ r: 6 }}
                  strokeWidth={2}
                />
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
            data={foodActions.length > 0 ? foodActions : []}
            title="Histórico de Alimentação"
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

        <div className="flex items-center justify-between px-1">
          <Label className="flex items-center gap-2">
            <Wheat size={16} />
            Modo automático
          </Label>
          <Switch checked={autoMode} onCheckedChange={setAutoMode} />
        </div>

        <Button
          onClick={handleReleaseFood}
          disabled={isDisabled || actionsLoading}
          className="w-full h-12 text-base cursor-pointer"
        >
          {actionsLoading ? "Processando..." : "Liberar Comida"}
        </Button>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary" className="w-full h-12 cursor-pointer">
              Abastecer Comida <Plus className="ml-2 h-5 w-5" />
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px] w-[90%] rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-center">
                Abastecer Comida
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="quantity">Quantidade (g)</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="h-12"
                />
              </div>

              <Button onClick={handleAddFood} className="h-12" disabled={!quantity || actionsLoading}>
                {actionsLoading ? "Confirmando..." : "Confirmar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

