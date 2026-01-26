"use client";

import { useState } from "react";
import { Droplet, Lightbulb, Thermometer, Wheat, Timer } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/src/components/ui/card";
import { ActionsTable } from "@/src/components/shared/actions-table";
import StatusCard from "./components/status-card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Slider } from "@/src/components/ui/slider";
import { Label } from "@/src/components/ui/label";

/* ---------------- MOCK ---------------- */

const systemStatus = {
  water: { status: "Atenção" },
  food: { quantity: "280g", status: "Abastecido" },
  temperature: { value: 27 },
  luminosity: { status: "Acesa" },
};

const dashboardData = [
  {
    id: "1",
    system: "Água",
    action: "Liberação manual",
    type: "Manual",
    time: "10:20",
  },
  {
    id: "2",
    system: "Luminosidade",
    action: "Ajuste automático",
    type: "Automático",
    time: "06:00",
  },
  {
    id: "3",
    system: "Alimentação",
    action: "Abastecimento",
    type: "Manual",
    time: "08:15",
  },
];

export default function Home() {
  const [delay, setDelay] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);

  function handleSaveDelay() {
    console.log(`Delay configurado para ${delay} segundos`);
    setDialogOpen(false);
  }

  return (
    <div className="flex flex-col gap-6 px-4 md:px-8 py-4 w-full lg:max-w-5xl">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatusCard
          title="Água"
          value={systemStatus.water.status}
          description="Status atual"
          icon={<Droplet />}
          href="/water"
        />

        <StatusCard
          title="Alimentação"
          value={systemStatus.food.quantity}
          description={systemStatus.food.status}
          icon={<Wheat />}
          href="/food"
        />

        <StatusCard
          title="Temperatura"
          value={`${systemStatus.temperature.value}ºC`}
          description="Atual"
          icon={<Thermometer />}
          href="/temperature"
        />

        <StatusCard
          title="Luminosidade"
          value={systemStatus.luminosity.status}
          description="Status"
          icon={<Lightbulb />}
          href="/luminosity"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Alertas</CardTitle>
          <CardDescription className="text-green-500">
            Nenhum alerta crítico no momento
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="overflow-x-auto">
        <ActionsTable
          title="Últimas Ações do Sistema"
          columns={[
            { accessorKey: "system", header: "Sistema" },
            { accessorKey: "action", header: "Ação" },
            { accessorKey: "type", header: "Tipo" },
            { accessorKey: "time", header: "Horário" },
          ]}
          data={dashboardData}
        />
      </div>

      <div className="flex justify-end pt-4">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="default" className="h-12 cursor-pointer w-full">
              Configurar sensores
              <Timer className="ml-2 h-5 w-5" />
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[420px] w-[90%] rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-center">
                Delay de leitura dos sensores
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-6 py-4">
              <div className="space-y-2">
                <Label>
                  Intervalo de leitura:{" "}
                  <span className="font-semibold">{delay}s</span>
                </Label>

                <Slider
                  min={5}
                  max={60}
                  step={1}
                  value={[delay]}
                  onValueChange={(v) => setDelay(v[0])}
                />

                <p className="text-sm text-muted-foreground">
                  Define de quanto em quanto tempo os dados serão buscados do ESP.
                </p>
              </div>

              <Button onClick={handleSaveDelay} className="h-12 cursor-pointer">
                Salvar configuração
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
