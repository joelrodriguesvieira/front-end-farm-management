"use client";

import { useState } from "react";
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

/* ---------------- MOCK ---------------- */

const foodHistoryMock = [
  { id: "1", user: "Joel", quantity: "50g", dateTime: "08:00" },
  { id: "2", user: "Sistema", quantity: "30g", dateTime: "12:00" },
  { id: "3", user: "Henrique", quantity: "70g", dateTime: "18:00" },
];

const foodChartMock = [
  { time: "08h", level: 90 },
  { time: "10h", level: 75 },
  { time: "12h", level: 60 },
  { time: "14h", level: 45 },
  { time: "16h", level: 30 },
];

export default function FoodPage() {
  const [quantity, setQuantity] = useState("");
  const [foodLevel, setFoodLevel] = useState(45);
  const [blocked, setBlocked] = useState(false);
  const [autoMode, setAutoMode] = useState(true);
  const [loading, setLoading] = useState(false);

  const getStatus = () => {
    if (foodLevel > 50) return "Normal";
    if (foodLevel > 20) return "Atenção";
    return "Crítico";
  };

  const handleAddFood = () => {
    setFoodLevel((prev) => Math.min(prev + Number(quantity) / 5, 100));
    setQuantity("");
  };

  const handleReleaseFood = () => {
    setLoading(true);
    setTimeout(() => {
      setFoodLevel((prev) => Math.max(prev - 10, 0));
      setLoading(false);
    }, 700);
  };

  const isDisabled = blocked || getStatus() === "Crítico";

  return (
    <div className="flex flex-col min-h-[calc(100vh-2rem)] gap-6 px-4 md:px-8 py-4 pb-10 w-full lg:max-w-5xl">
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold">Alimentação</h1>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <Card>
            <CardHeader className="px-6">
              <CardDescription>Quantidade atual</CardDescription>
              <CardTitle className="text-2xl tabular-nums">
                {foodLevel}%
              </CardTitle>
              <Progress value={foodLevel} className="mt-4 h-3" />
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
                {foodLevel > 30 ? "2 dias" : "Menos de 1 dia"}
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
          disabled={isDisabled || loading}
          className="w-full h-12 text-base cursor-pointer"
        >
          Liberar Comida
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

              <Button onClick={handleAddFood} className="h-12">
                Confirmar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
