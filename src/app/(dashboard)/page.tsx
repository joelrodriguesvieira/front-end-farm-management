"use client";

import { Droplet, Lightbulb, Thermometer, Wheat } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/src/components/ui/card";
import { ActionsTable } from "@/src/components/shared/actions-table";
import StatusCard from "./components/status-card";
import { sensorsService, actionsService, Action, SensorData } from "@/src/lib/api";

interface SystemStatus {
  water: { level: number; status: string };
  food: { quantity: string; status: string };
  temperature: { value: number };
  luminosity: { value: number; mode: string };
}

interface DashboardAction {
  id: string;
  system: string;
  action: string;
  type: string;
  time: string;
}

export default function Home() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    water: { level: 0, status: "Carregando..." },
    food: { quantity: "0g", status: "Carregando..." },
    temperature: { value: 0 },
    luminosity: { value: 0, mode: "Manual" },
  });

  const [dashboardData, setDashboardData] = useState<DashboardAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Buscar dados de sensores
        const sensorData = await sensorsService.getCurrent();
        
        // Buscar ações recentes
        const actionsData = await actionsService.listAll(undefined, 10, 0);

        // Atualizar status do sistema com base nos sensores
        setSystemStatus({
          water: {
            level: sensorData?.waterLevel ?? 0,
            status: (sensorData?.waterLevel ?? 0) > 50 ? "Abastecido" : "Atenção",
          },
          food: {
            quantity: `${(sensorData?.rationWeight ?? 0).toFixed(1)}g`,
            status: (sensorData?.rationWeight ?? 0) > 100 ? "Abastecido" : "Baixo",
          },
          temperature: {
            value: sensorData?.temperature ?? 0,
          },
          luminosity: {
            value: sensorData?.luminosity ?? 0,
            mode: "Auto",
          },
        });

        // Mapear ações para o formato do dashboard
        const formattedActions: DashboardAction[] = (actionsData || []).map((action: Action) => ({
          id: action.id,
          system: action.system,
          action: action.action,
          type: action.quantity > 0 ? "Manual" : "Automático",
          time: new Date(action.createdAt || "").toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }));

        setDashboardData(formattedActions);
        setError(null);
      } catch (err) {
        console.error("Erro ao buscar dados do dashboard:", err);
        setError("Erro ao carregar dados do dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    // Atualizar a cada 30 segundos
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-6 px-4 md:px-8 py-4 w-full lg:max-w-5xl">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <Card>
          <CardHeader>Carregando dados...</CardHeader>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6 px-4 md:px-8 py-4 w-full lg:max-w-5xl">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardDescription className="text-red-700">{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

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
