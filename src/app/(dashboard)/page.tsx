"use client";

import { useState, useEffect } from "react";
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
import { useSensor, useConfig, useActions } from "@/src/hooks/useApi";
import { Skeleton } from "@/src/components/ui/skeleton";
import { apiService } from "@/src/lib/api";

export default function Home() {
  const [delay, setDelay] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [lightStatus, setLightStatus] = useState("--");
  const [loadingLightStatus, setLoadingLightStatus] = useState(true);
  
  const { sensor } = useSensor();
  const { updateConfig } = useConfig();
  const { actions, loading: actionsLoading, error: actionsError } = useActions();

  // Fetch light status
  useEffect(() => {
    const fetchLightStatus = async () => {
      try {
        setLoadingLightStatus(true);
        const lightActions = await apiService.getActions(1, 0, "light");
        
        if (lightActions && lightActions.length > 0) {
          const isOn = lightActions[0].action === "ON";
          setLightStatus(isOn ? "Acesa" : "Apagada");
        } else {
          setLightStatus("--");
        }
      } catch (error) {
        console.error("Erro ao buscar status da luz:", error);
        setLightStatus("--");
      } finally {
        setLoadingLightStatus(false);
      }
    };

    fetchLightStatus();
  }, []);

  async function handleSaveDelay() {
    try {
      await updateConfig({ saveInterval: delay });
      setDialogOpen(false);
    } catch (error) {
      console.error("Erro ao salvar configuração:", error);
    }
  }

  // Water status
  const waterStatus = sensor?.waterLevel ? "Nível Alto" : "Nível Baixo";



  // Format actions data for table
  const tableData = actions.map((action) => {
    const date = new Date(action.createdAt);
    const timeString = date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return {
      id: action.id.toString(),
      system: action.system.charAt(0).toUpperCase() + action.system.slice(1),
      action: action.action.replace(/_/g, " "),
      type: action.user?.name || "Sistema",
      time: timeString,
    };
  });

  return (
    <div className="flex flex-col gap-6 px-4 md:px-8 py-4 w-full lg:max-w-5xl">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      {/* STATUS */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatusCard
          title="Água"
          value={waterStatus}
          description="Status atual"
          icon={<Droplet />}
          href="/water"
        />

        <StatusCard
          title="Alimentação"
          value={sensor?.rationWeight ? `${sensor.rationWeight}g` : "--"}
          description="Peso do comedouro"
          icon={<Wheat />}
          href="/food"
        />

        <StatusCard
          title="Temperatura"
          value={sensor?.temperature ? `${sensor.temperature}ºC` : "--"}
          description="Atual"
          icon={<Thermometer />}
          href="/temperature"
        />

        <StatusCard
          title="Luminosidade"
          value={loadingLightStatus ? <Skeleton className="h-6 w-16" /> : lightStatus}
          description="Status"
          icon={<Lightbulb />}
          href="/luminosity"
        />
      </div>

      {/* ALERTAS */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Alertas</CardTitle>
          <CardDescription className="text-green-500">
            Nenhum alerta crítico no momento
          </CardDescription>
        </CardHeader>
      </Card>

      {/* HISTÓRICO */}
      <div className="overflow-x-auto">
        {actionsError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded text-sm text-red-600 mb-4">
            Erro ao carregar histórico: {actionsError.message}
          </div>
        )}
        {actionsLoading ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Últimas Ações do Sistema</CardTitle>
            </CardHeader>
            <div className="px-6 pb-4 space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          </Card>
        ) : (
          <ActionsTable
            title="Últimas Ações do Sistema"
            columns={[
              { accessorKey: "system", header: "Sistema" },
              { accessorKey: "action", header: "Ação" },
              { accessorKey: "type", header: "Tipo" },
              { accessorKey: "time", header: "Horário" },
            ]}
            data={tableData}
          />
        )}
      </div>

      {/* CONFIGURAÇÃO DE SENSORES */}
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
                  min={0}
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
