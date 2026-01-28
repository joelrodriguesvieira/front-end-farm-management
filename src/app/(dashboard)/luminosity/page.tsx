"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/src/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Switch } from "@/src/components/ui/switch";
import { Label } from "@/src/components/ui/label";
import { Lightbulb, Power, Clock } from "lucide-react";
import { ActionsTable } from "@/src/components/shared/actions-table";
import { Input } from "@/src/components/ui/input";
import { useConfig, useActions, useSensor } from "@/src/hooks/useApi";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";
import { Skeleton } from "@/src/components/ui/skeleton";
import { apiService } from "@/src/lib/api";

export default function LuminosityPage() {
  const { userId } = useCurrentUser();
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [onTime, setOnTime] = useState("06:00");
  const [offTime, setOffTime] = useState("18:00");
  const [commandLoading, setCommandLoading] = useState(false);
  const [isOn, setIsOn] = useState(false);
  const [loadingLightStatus, setLoadingLightStatus] = useState(true);

  const { config, updateConfig, loading: configLoading, error: configError } = useConfig();
  const { actions, loading: actionsLoading, error: actionsError } = useActions();
  const { sensor, loading: sensorLoading, error: sensorError } = useSensor();

  // Fetch last light command to determine current status
  useEffect(() => {
    const fetchLightStatus = async () => {
      try {
        setLoadingLightStatus(true);
        const lightActions = await apiService.getActions(1, 0, "light");
        
        if (lightActions && lightActions.length > 0) {
          const isOn = lightActions[0].action === "ON";
          setIsOn(isOn);
        }
      } catch (error) {
        console.error("Erro ao buscar status da luz:", error);
      } finally {
        setLoadingLightStatus(false);
      }
    };

    fetchLightStatus();
  }, []);

  // Update local state when config loads
  useEffect(() => {
    if (config?.light?.onTime) setOnTime(config.light.onTime);
    if (config?.light?.offTime) setOffTime(config.light.offTime);
  }, [config]);

  const autoMode = config?.mode === "auto";

  const handleToggleLight = async () => {
    if (!userId) {
      alert("Usuário não identificado");
      return;
    }
    try {
      setCommandLoading(true);
      const newState = isOn ? "OFF" : "ON";
      await apiService.sendCommand({
        actuator: "light",
        state: newState,
        userId,
      });
      setIsOn((prev) => !prev);
    } catch (error) {
      console.error("Erro ao enviar comando:", error);
      alert("Erro ao enviar comando para luz");
    } finally {
      setCommandLoading(false);
    }
  };

  const handleToggleAutoMode = async () => {
    try {
      const newMode = autoMode ? "manual" : "auto";
      await updateConfig({ mode: newMode });
    } catch (error) {
      console.error("Failed to toggle auto mode:", error);
    }
  };

  const handleSaveSchedule = async () => {
    try {
      await updateConfig({
        light: {
          control: "schedule",
          ldrThreshold: config?.light?.ldrThreshold,
          onTime,
          offTime,
        },
      });
      setScheduleOpen(false);
    } catch (error) {
      console.error("Failed to save schedule:", error);
    }
  };

  // Format actions data for table
  const luminosityHistoryData = actions
    .filter((a) => a.system === "light")
    .slice(0, 10)
    .map((action) => {
      const date = new Date(action.createdAt);
      const timeString = date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });
      return {
        id: action.id.toString(),
        user: action.user?.name || "Sistema",
        action: action.action.replace(/_/g, " "),
        time: timeString,
      };
    });

  return (
    <div className="flex flex-col min-h-[calc(100vh-2rem)] gap-6 px-4 md:px-8 py-4 pb-10 w-full lg:max-w-5xl">
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold">Luminosidade</h1>

        {(configError || actionsError || sensorError) && (
          <div className="p-4 bg-red-50 border border-red-200 rounded text-sm text-red-600">
            {configError && <p>❌ Erro ao carregar configurações: {configError.message}</p>}
            {actionsError && <p>❌ Erro ao carregar histórico: {actionsError.message}</p>}
            {sensorError && <p>❌ Erro ao carregar sensores: {sensorError.message}</p>}
          </div>
        )}

        {/* STATUS */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <Card>
            <CardHeader className="px-6">
              <CardDescription>Luminosidade atual</CardDescription>
              <CardTitle className="text-2xl">
                {sensorLoading ? <Skeleton className="h-8 w-16" /> : `${sensor?.luminosity || 0} lux`}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="px-6">
              <CardDescription>Estado da luz</CardDescription>
              <CardTitle
                className={`text-2xl flex items-center gap-2 ${
                  isOn ? "text-green-500" : "text-muted-foreground"
                }`}
              >
                <Lightbulb className="h-6 w-6" />
                {loadingLightStatus ? <Skeleton className="h-8 w-20" /> : (isOn ? "Acesa" : "Apagada")}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="px-6">
              <CardDescription>Modo de operação</CardDescription>
              <CardTitle className="text-2xl">
                {configLoading ? <Skeleton className="h-8 w-24" /> : (autoMode ? "Automático" : "Manual")}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <div className="overflow-x-auto">
          <ActionsTable
            title={actionsLoading ? "Carregando histórico..." : "Histórico de ações"}
            columns={[
              { accessorKey: "user", header: "Usuário" },
              { accessorKey: "action", header: "Ação" },
              { accessorKey: "time", header: "Horário" },
            ]}
            data={actionsLoading ? [] : luminosityHistoryData}
          />
        </div>
      </div>

      <div className="flex flex-col gap-6 pb-6 md:pb-12 mt-4">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2">
            <Lightbulb size={16} />
            Modo automático
          </Label>
          <Switch
            checked={autoMode}
            onCheckedChange={handleToggleAutoMode}
            disabled={configLoading}
          />
        </div>

        <Button
          onClick={handleToggleLight}
          disabled={autoMode || commandLoading}
          variant={isOn ? "destructive" : "default"}
          className="w-full h-12"
        >
          {commandLoading ? (
            <>Enviando comando...</>
          ) : (
            <>
              {isOn ? "Desligar Luz" : "Ligar Luz"}
              <Power className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>

        <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
          <DialogTrigger asChild>
            <Button
              disabled={!autoMode}
              variant="secondary"
              className="w-full h-12"
            >
              Definir horários
              <Clock className="ml-2 h-5 w-5" />
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[400px] w-[90%] rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-center">
                Agendamento automático
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Horário para ligar</Label>
                <Input
                  type="time"
                  value={onTime}
                  onChange={(e) => setOnTime(e.target.value)}
                  className="h-12"
                />
              </div>

              <div className="grid gap-2">
                <Label>Horário para desligar</Label>
                <Input
                  type="time"
                  value={offTime}
                  onChange={(e) => setOffTime(e.target.value)}
                  className="h-12"
                />
              </div>

              <Button
                className="w-full h-12"
                onClick={handleSaveSchedule}
                disabled={configLoading}
              >
                Salvar agendamento
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
