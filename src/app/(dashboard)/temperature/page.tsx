"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { TemperatureChart } from "./components/temperature-chart";
import { Button } from "@/src/components/ui/button";
import { Power } from "lucide-react";
import { useState, useEffect } from "react";
import { sensorsService, SensorData } from "@/src/lib/api";

export default function TemperaturePage() {
  const [ventOn, setVentOn] = useState(false);
  const [currentSensor, setCurrentSensor] = useState<SensorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentSensor = async () => {
      try {
        setLoading(true);
        const data = await sensorsService.getCurrent();
        setCurrentSensor(data);
        setError(null);
      } catch (err) {
        console.error("Erro ao buscar dados de sensores:", err);
        setError("Erro ao carregar dados dos sensores");
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentSensor();
    // Atualizar a cada 30 segundos
    const interval = setInterval(fetchCurrentSensor, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleVent = () => {
    setTimeout(() => {
      setVentOn(!ventOn);
    }, 200);
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-[calc(100vh-2rem)] gap-6 px-4 md:px-8 py-4 pb-10 w-full lg:max-w-5xl">
        <h1 className="text-2xl font-semibold">Temperatura</h1>
        <Card className="animate-pulse">
          <CardHeader>Carregando...</CardHeader>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-[calc(100vh-2rem)] gap-6 px-4 md:px-8 py-4 pb-10 w-full lg:max-w-5xl">
        <h1 className="text-2xl font-semibold">Temperatura</h1>
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardDescription className="text-red-700">{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-2rem)] gap-6 px-4 md:px-8 py-4 pb-10 w-full lg:max-w-5xl">
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold">Temperatura</h1>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Card className="sm:min-w-[150px] lg:min-w-[180px]">
            <CardHeader className="flex flex-col justify-center items-center lg:items-start px-6">
              <CardDescription>Temperatura atual</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums">
                {currentSensor?.temperature ?? "--"}º
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="sm:min-w-[150px] lg:min-w-[180px]">
            <CardHeader className="flex flex-col justify-center items-center lg:items-start px-6">
              <CardDescription>Umidade atual</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums">
                {currentSensor?.humidity ?? "--"}%
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <TemperatureChart />
      </div>

      <div className="flex-1" />

      <div className="w-full pb-6 md:pb-12 mt-4">
        <Button
          onClick={handleToggleVent}
          variant={ventOn ? "destructive" : "default"}
          className="cursor-pointer w-full h-12 text-base"
        >
          {ventOn ? "Desligar Ventilação" : "Ligar Ventilação"}{" "}
          <Power className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
