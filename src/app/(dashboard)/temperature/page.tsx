"use client";

import { useState } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { TemperatureChart } from "./components/temperature-chart";
import { Button } from "@/src/components/ui/button";
import { Power } from "lucide-react";
import { useState } from "react";
import { useSensor } from "@/src/hooks/useApi";
import { Skeleton } from "@/src/components/ui/skeleton";
import { apiService } from "@/src/lib/api";

export default function TemperaturePage() {
  const [ventOn, setVentOn] = useState(false);
  const [commandLoading, setCommandLoading] = useState(false);
  const { sensor, loading: sensorLoading, error: sensorError } = useSensor();

  const handleToggleVent = async () => {
    try {
      setCommandLoading(true);
      const newState = ventOn ? "OFF" : "ON";
      await apiService.sendCommand({
        actuator: "fan",
        state: newState,
        userId: 1,
      });
      setVentOn((prev) => !prev);
    } catch (error) {
      console.error("Erro ao enviar comando:", error);
      alert("Erro ao enviar comando para ventilação");
    } finally {
      setCommandLoading(false);
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
                {ventStatusLabel}
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
