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
import { useState } from "react";
import { useSensor, useDevices } from "@/src/hooks/useApi";
import { Skeleton } from "@/src/components/ui/skeleton";

export default function TemperaturePage() {
  const [ventOn, setVentOn] = useState(false);
  const { sensor, loading: sensorLoading, error: sensorError } = useSensor();
  const { devices, updateDeviceStatus, loading: devicesLoading } = useDevices();

  // Find fan device (ventilador)
  const fanDevice = devices.find((d) => d.type === "fan");

  const handleToggleVent = async () => {
    if (!fanDevice) return;
    try {
      const newStatus = ventOn ? "off" : "on";
      await updateDeviceStatus(fanDevice.id, newStatus as "on" | "off");
      setVentOn(!ventOn);
    } catch (error) {
      console.error("Failed to toggle ventilation:", error);
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

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Card className="sm:min-w-[150px] lg:min-w-[180px]">
            <CardHeader className="flex flex-col justify-center items-center lg:items-start px-6">
              <CardDescription>Temperatura atual</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums">
                {sensorLoading ? <Skeleton className="h-8 w-16" /> : `${sensor?.temperature || "--"}º`}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="sm:min-w-[150px] lg:min-w-[180px]">
            <CardHeader className="flex flex-col justify-center items-center lg:items-start px-6">
              <CardDescription>Umidade atual</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums">
                {sensorLoading ? <Skeleton className="h-8 w-16" /> : `${sensor?.humidity || "--"}%`}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <TemperatureChart />
      </div>

      <div className="w-full pb-6 md:pb-12 mt-4">
        <Button
          onClick={handleToggleVent}
          disabled={devicesLoading || !fanDevice}
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
