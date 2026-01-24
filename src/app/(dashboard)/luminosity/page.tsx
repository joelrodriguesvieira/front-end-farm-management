"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/src/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Switch } from "@/src/components/ui/switch";
import { Label } from "@/src/components/ui/label";
import { Lightbulb, Power, Clock } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Input } from "@/src/components/ui/input";
import { ActionsTable } from "@/src/components/shared/actions-table";
import { Slider } from "@/src/components/ui/slider";
import { useSensors } from "@/src/hooks/use-sensors";
import { useConfig } from "@/src/hooks/use-config";
import { useActions } from "@/src/hooks/use-actions";

interface LuminosityAction {
  id: string;
  user: string;
  action: string;
  time: string;
}

export default function LuminosityPage() {
  const { currentData, loading: sensorsLoading, error: sensorsError } = useSensors();
  const { config, update: updateConfig, loading: configLoading } = useConfig();
  const { actions: apiActions, create: createAction, loading: actionsLoading } = useActions();
  
  const [intensity, setIntensity] = useState(70);
  const [isOn, setIsOn] = useState(true);
  const [autoMode, setAutoMode] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduleTime, setScheduleTime] = useState("06:00");
  const [luminosityActions, setLuminosityActions] = useState<LuminosityAction[]>([]);
  const [chartData, setChartData] = useState<Array<{ time: string; value: number }>>([]);

  const luminosity = currentData?.luminosity ?? 0;

  useEffect(() => {
    if (apiActions && apiActions.length > 0) {
      const mapped: LuminosityAction[] = apiActions.map((action) => ({
        id: action.id,
        user: action.user?.name || "Sistema",
        action: `${action.action} - ${action.quantity}%`,
        time: new Date(action.createdAt || "").toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));
      setLuminosityActions(mapped);
    }
  }, [apiActions]);

  useEffect(() => {
    // Gerar dados de gráfico baseado na luminosidade atual
    const now = new Date();
    const data = [];
    for (let i = 5; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 30 * 60000);
      const hours = time.getHours().toString().padStart(2, "0");
      const baseValue = hours >= "18" || hours <= "06" ? 20 : 70;
      data.push({
        time: `${hours}h`,
        value: Math.max(baseValue - (5 - i) * 10, Math.ceil(luminosity / 10)),
      });
    }
    setChartData(data);
  }, [luminosity]);

  const getStatus = () => {
    if (!isOn || intensity === 0) return "Desligada";
    if (intensity < 40) return "Baixa";
    if (intensity < 80) return "Ideal";
    return "Alta";
  };

  const handleToggleLight = async () => {
    const newState = !isOn;
    setIsOn(newState);
    if (!newState) setIntensity(0);
    
    try {
      await createAction({
        userId: "user-id",
        system: "lighting",
        action: newState ? "Ligar luz" : "Desligar luz",
        quantity: newState ? intensity : 0,
      });
    } catch (err) {
      console.error("Erro ao controlar luz:", err);
    }
  };

  const handleAutoModeChange = async (value: boolean) => {
    setAutoMode(value);
    
    try {
      await updateConfig({
        lighting: {
          enabled: value,
          schedule: { on: "06:00", off: "20:00" },
        },
      });
    } catch (err) {
      console.error("Erro ao atualizar configuração:", err);
    }
  };

  const handleSchedule = async () => {
    try {
      await updateConfig({
        lighting: {
          enabled: true,
          schedule: { on: scheduleTime, off: "20:00" },
        },
      });
      setScheduleOpen(false);
    } catch (err) {
      console.error("Erro ao agendar:", err);
    }
  };

  if (sensorsLoading && !currentData) {
    return (
      <div className="flex flex-col gap-6 px-4 md:px-8 py-4 w-full">
        <h1 className="text-2xl font-semibold">Luminosidade</h1>
        <Card className="animate-pulse">
          <CardHeader>Carregando...</CardHeader>
        </Card>
      </div>
    );
  }

  if (sensorsError) {
    return (
      <div className="flex flex-col gap-6 px-4 md:px-8 py-4 w-full">
        <h1 className="text-2xl font-semibold">Luminosidade</h1>
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
        <h1 className="text-2xl font-semibold">Luminosidade</h1>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <Card>
            <CardHeader className="px-6">
              <CardDescription>Luminosidade atual</CardDescription>
              <CardTitle className="text-2xl tabular-nums">
                {luminosity.toFixed(0)}%
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="px-6">
              <CardDescription>Modo</CardDescription>
              <CardTitle className="text-2xl">
                {autoMode ? "Automático" : "Manual"}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="px-6">
              <CardDescription>Status</CardDescription>
              <CardTitle
                className={`text-2xl ${
                  getStatus() === "Alta"
                    ? "text-yellow-500"
                    : getStatus() === "Ideal"
                    ? "text-green-500"
                    : "text-muted-foreground"
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
              Histórico de luminosidade
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
                  dataKey="value"
                  stroke="#fbbf24"
                  dot={{ fill: "#fbbf24", r: 4 }}
                  activeDot={{ r: 6 }}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="overflow-x-auto">
          <ActionsTable
            title="Histórico de Ações"
            columns={[
              { accessorKey: "user", header: "Usuário" },
              { accessorKey: "action", header: "Ação" },
              { accessorKey: "time", header: "Horário" },
            ]}
            data={luminosityActions.length > 0 ? luminosityActions : []}
          />
        </div>
      </div>

      <div className="flex-1" />

      <div className="flex flex-col gap-6 pb-6 md:pb-12 mt-4">
        <div className="space-y-2">
          <Label>Intensidade da luz</Label>
          <Slider
            value={[intensity]}
            min={0}
            max={100}
            step={5}
            disabled={!isOn || autoMode}
            onValueChange={(v) => setIntensity(v[0])}
          />
          <p className="text-sm text-gray-500">{intensity}%</p>
        </div>

        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2">
            <Lightbulb size={16} />
            Modo automático
          </Label>
          <Switch checked={autoMode} onCheckedChange={handleAutoModeChange} disabled={configLoading} />
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={handleToggleLight}
            variant={isOn ? "destructive" : "default"}
            className="w-full h-12"
            disabled={actionsLoading}
          >
            {actionsLoading ? "Processando..." : isOn ? "Desligar Luz" : "Ligar Luz"}
            <Power className="ml-2 h-5 w-5" />
          </Button>

          <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
            <DialogTrigger asChild>
              <Button
                disabled={!autoMode || configLoading}
                variant="secondary"
                className="w-full h-12 cursor-pointer"
              >
                Agendar Ligamento
                <Clock className="ml-2 h-5 w-5" />
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[400px] w-[90%] rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-center">
                  Definir horário de ligamento
                </DialogTitle>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Horário</Label>
                  <Input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="h-12 text-lg"
                  />
                </div>

                <Button
                  className="w-full h-12 cursor-pointer"
                  onClick={handleSchedule}
                  disabled={configLoading}
                >
                  {configLoading ? "Salvando..." : "Salvar agendamento"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

