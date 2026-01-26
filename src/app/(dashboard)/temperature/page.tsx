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
import { Switch } from "@/src/components/ui/switch";
import { Label } from "@/src/components/ui/label";
import { Power, Fan } from "lucide-react";
import { mockSensorsCurrent } from "@/src/mocks/sensors";

export default function TemperaturePage() {
  const [ventOn, setVentOn] = useState(false);
  const [autoMode, setAutoMode] = useState(true);

  const handleToggleVent = () => {
    setTimeout(() => {
      setVentOn((prev) => !prev);
    }, 200);
  };

  const ventStatusLabel = ventOn ? "Ligada" : "Desligada";

  return (
    <div className="flex flex-col min-h-[calc(100vh-2rem)] gap-6 px-4 md:px-8 py-4 pb-10 w-full lg:max-w-5xl">
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold">Temperatura</h1>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <Card>
            <CardHeader className="px-6">
              <CardDescription>Temperatura atual</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums">
                {mockSensorsCurrent.temperature}ºC
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="px-6">
              <CardDescription>Umidade atual</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums">
                {mockSensorsCurrent.humidity}%
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
          disabled={autoMode}
          variant={ventOn ? "destructive" : "default"}
          className="cursor-pointer w-full h-12 text-base"
        >
          {ventOn ? "Desligar Ventilação" : "Ligar Ventilação"}
          <Power className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
