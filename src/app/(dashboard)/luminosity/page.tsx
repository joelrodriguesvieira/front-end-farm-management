"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Switch } from "@/src/components/ui/switch";
import { Label } from "@/src/components/ui/label";
import { Lightbulb, Power, Sunrise } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { ActionsTable } from "@/src/components/shared/actions-table";
import { Slider } from "@/src/components/ui/slider";

const luminosityChartMock = [
  { time: "06h", value: 10 },
  { time: "08h", value: 40 },
  { time: "10h", value: 70 },
  { time: "12h", value: 90 },
  { time: "14h", value: 80 },
  { time: "16h", value: 60 },
  { time: "18h", value: 30 },
];

const luminosityHistoryMock = [
  { id: "1", user: "Sistema", action: "Automático", time: "06:00" },
  { id: "2", user: "Joel", action: "Manual 80%", time: "10:15" },
  { id: "3", user: "Sistema", action: "Desligado", time: "18:00" },
];

export default function LuminosityPage() {
  const [intensity, setIntensity] = useState(70);
  const [isOn, setIsOn] = useState(true);
  const [autoMode, setAutoMode] = useState(false);
  const [sunriseMode, setSunriseMode] = useState(false);

  const getStatus = () => {
    if (!isOn || intensity === 0) return "Baixa";
    if (intensity < 40) return "Baixa";
    if (intensity < 80) return "Ideal";
    return "Alta";
  };

  const handleToggleLight = () => {
    setIsOn((prev) => !prev);
    if (!isOn) setIntensity(60);
  };

  const handleSunrise = () => {
    setSunriseMode(true);
    setIsOn(true);
    let value = 0;

    const interval = setInterval(() => {
      value += 10;
      setIntensity(value);

      if (value >= 100) {
        clearInterval(interval);
        setSunriseMode(false);
      }
    }, 400);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-2rem)] gap-6 px-4 md:px-8 py-4 pb-10 w-full lg:max-w-5xl">
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold">Luminosidade</h1>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <Card>
            <CardHeader className="px-6">
              <CardDescription>Luminosidade atual</CardDescription>
              <CardTitle className="text-2xl tabular-nums">
                {isOn ? `${intensity}%` : "Desligada"}
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
              <LineChart data={luminosityChartMock}>
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" strokeWidth={2} />
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
            data={luminosityHistoryMock}
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
        </div>

        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2">
            <Lightbulb size={16} />
            Modo automático
          </Label>
          <Switch checked={autoMode} onCheckedChange={setAutoMode} />
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={handleToggleLight}
            variant={isOn ? "destructive" : "default"}
            className="w-full h-12"
          >
            {isOn ? "Desligar Luz" : "Ligar Luz"}
            <Power className="ml-2 h-5 w-5" />
          </Button>

          <Button
            onClick={handleSunrise}
            disabled={sunriseMode || autoMode}
            variant="secondary"
            className="w-full h-12"
          >
            Amanhecer
            <Sunrise className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
