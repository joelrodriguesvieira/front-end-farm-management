"use client";

import { Droplet, Lightbulb, Thermometer, Wheat } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/src/components/ui/card";
import { ActionsTable } from "@/src/components/shared/actions-table";
import StatusCard from "./components/status-card";

const systemStatus = {
  water: { level: 45, status: "Atenção" },
  food: { quantity: "280g", status: "Abastecido" },
  temperature: { value: 27 },
  luminosity: { value: 70, mode: "Manual" },
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
  return (
    <div className="flex flex-col gap-6 px-4 md:px-8 py-4 w-full lg:max-w-5xl">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatusCard
          title="Água"
          value={`${systemStatus.water.level}%`}
          description={systemStatus.water.status}
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
          value={`${systemStatus.luminosity.value}%`}
          description={systemStatus.luminosity.mode}
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
    </div>
  );
}
