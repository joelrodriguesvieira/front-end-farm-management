"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { TemperatureChart } from "./components/temperature-chart";
import { Button } from "@/src/components/ui/button";
import { Power, Fan, Sliders } from "lucide-react";
import { Label } from "@/src/components/ui/label";
import { Switch } from "@/src/components/ui/switch";
import { Input } from "@/src/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { useSensor } from "@/src/hooks/useApi";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";
import { Skeleton } from "@/src/components/ui/skeleton";
import { apiService } from "@/src/lib/api";

export default function TemperaturePage() {
  const { userId } = useCurrentUser();
  const [ventOn, setVentOn] = useState(false);
  const [autoMode, setAutoMode] = useState(false);
  const [commandLoading, setCommandLoading] = useState(false);
  const [loadingVentStatus, setLoadingVentStatus] = useState(true);
  const [limitsOpen, setLimitsOpen] = useState(false);
  const [minTemp, setMinTemp] = useState<number>(20);
  const [maxTemp, setMaxTemp] = useState<number>(30);
  const [savingLimits, setSavingLimits] = useState(false);
  const [limitError, setLimitError] = useState<string | null>(null);
  const { sensor, loading: sensorLoading, error: sensorError } = useSensor();

  // Fetch last fan command to determine current status
  useEffect(() => {
    const fetchVentStatus = async () => {
      try {
        setLoadingVentStatus(true);
        const fanActions = await apiService.getActions(1, 0, "fan");
        
        if (fanActions && fanActions.length > 0) {
          const isOn = fanActions[0].action === "ON";
          setVentOn(isOn);
        }
      } catch (error) {
        console.error("Erro ao buscar status da ventilação:", error);
      } finally {
        setLoadingVentStatus(false);
      }
    };

    fetchVentStatus();
  }, []);

  const handleToggleVent = async () => {
    if (!userId) {
      alert("Usuário não identificado");
      return;
    }
    try {
      setCommandLoading(true);
      const newState = ventOn ? "OFF" : "ON";
      await apiService.sendCommand({
        actuator: "fan",
        state: newState,
        userId,
      });
      setVentOn((prev) => !prev);
    } catch (error) {
      console.error("Erro ao enviar comando:", error);
      alert("Erro ao enviar comando para ventilação");
    } finally {
      setCommandLoading(false);
    }
  };

  const handleSaveLimits = async () => {
    try {
      setSavingLimits(true);
      setLimitError(null);

      await apiService.updateConfig({
        temperature: {
          min: minTemp,
          max: maxTemp,
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

  if (sensorError) {
    return (
      <div className="flex flex-col min-h-[calc(100vh-2rem)] gap-6 px-4 md:px-8 py-4 pb-10 w-full lg:max-w-5xl">
        <h1 className="text-2xl font-semibold">Temperatura</h1>
        <p className="text-red-500">Erro ao carregar dados: {sensorError.message}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-2rem)] gap-6 px-4 md:px-8 py-4 pb-10 w-full lg:max-w-5xl">
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold">Temperatura</h1>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <Card>
            <CardHeader className="px-6">
              <CardDescription>Temperatura atual</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums">
                {sensorLoading ? <Skeleton className="h-8 w-16" /> : `${sensor?.temperature || "--"}º`}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="px-6">
              <CardDescription>Umidade atual</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums">
                {sensorLoading ? <Skeleton className="h-8 w-16" /> : `${sensor?.humidity || "--"}%`}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="px-6">
              <CardDescription>Ventilação</CardDescription>
              <CardTitle
                className={`text-2xl flex items-center gap-2 ${
                  ventOn ? "text-green-500" : "text-muted-foreground"
                }`}
              >
                <Fan className="h-6 w-6" />
                {loadingVentStatus ? <Skeleton className="h-8 w-20" /> : (ventOn ? "Ligada" : "Desligada")}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <TemperatureChart />
      </div>

      <div className="flex flex-col gap-6 pb-6 md:pb-12 mt-4">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2">
            <Fan size={16} />
            Modo automático
          </Label>
          <Switch checked={autoMode} onCheckedChange={setAutoMode} />
        </div>

        <Dialog open={limitsOpen} onOpenChange={setLimitsOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary" className="w-full h-12">
              Definir limites de temperatura
              <Sliders className="ml-2 h-5 w-5" />
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[400px] w-[90%] rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-center">
                Configurar limites de temperatura
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="min-temp">Temperatura mínima (°C)</Label>
                <Input
                  id="min-temp"
                  type="number"
                  step="0.1"
                  value={minTemp}
                  onChange={(e) => setMinTemp(Number(e.target.value))}
                  className="h-12"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="max-temp">Temperatura máxima (°C)</Label>
                <Input
                  id="max-temp"
                  type="number"
                  step="0.1"
                  value={maxTemp}
                  onChange={(e) => setMaxTemp(Number(e.target.value))}
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

        <Button
          onClick={handleToggleVent}
          disabled={commandLoading}
          variant={ventOn ? "destructive" : "default"}
          className="cursor-pointer w-full h-12 text-base"
        >
          {commandLoading ? (
            <>Enviando comando...</>
          ) : (
            <>
              {ventOn ? "Desligar Ventilação" : "Ligar Ventilação"}{" "}
              <Power className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
