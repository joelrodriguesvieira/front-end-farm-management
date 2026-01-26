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
import { useDevices, useConfig, useActions } from "@/src/hooks/useApi";
import { Skeleton } from "@/src/components/ui/skeleton";

export default function LuminosityPage() {
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [onTime, setOnTime] = useState("06:00");
  const [offTime, setOffTime] = useState("18:00");

  const { devices, updateDeviceStatus, loading: devicesLoading } = useDevices();
  const { config, updateConfig, loading: configLoading } = useConfig();
  const { actions } = useActions();

  // Update local state when config loads
  useEffect(() => {
    if (config?.light?.onTime) setOnTime(config.light.onTime);
    if (config?.light?.offTime) setOffTime(config.light.offTime);
  }, [config]);

  // Find lamp device
  const lampDevice = devices.find((d) => d.type === "lamp");
  const isOn = lampDevice?.status === "on";
  const autoMode = config?.mode === "auto";

  const handleToggleLight = async () => {
    if (!lampDevice) return;
    try {
      const newStatus = isOn ? "off" : "on";
      await updateDeviceStatus(lampDevice.id, newStatus as "on" | "off");
    } catch (error) {
      console.error("Failed to toggle light:", error);
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
          control: config?.light?.control || "manual",
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
        user: "Sistema",
        action: action.action.replace(/_/g, " "),
        time: timeString,
      };
    });

  const statusLabel = isOn ? "Acesa" : "Apagada";

  return (
    <div className="flex flex-col min-h-[calc(100vh-2rem)] gap-6 px-4 md:px-8 py-4 pb-10 w-full lg:max-w-5xl">
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold">Luminosidade</h1>

        {/* STATUS */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Card>
            <CardHeader className="px-6">
              <CardDescription>Estado atual</CardDescription>
              <CardTitle
                className={`text-2xl flex items-center gap-2 ${
                  isOn ? "text-green-500" : "text-muted-foreground"
                }`}
              >
                <Lightbulb className="h-6 w-6" />
                {devicesLoading ? <Skeleton className="h-8 w-20" /> : statusLabel}
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

        {/* HISTÓRICO */}
        <div className="overflow-x-auto">
          <ActionsTable
            title="Histórico de ações"
            columns={[
              { accessorKey: "user", header: "Usuário" },
              { accessorKey: "action", header: "Ação" },
              { accessorKey: "time", header: "Horário" },
            ]}
            data={luminosityHistoryData}
          />
        </div>
      </div>

      {/* CONTROLES */}
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
          disabled={autoMode || devicesLoading || !lampDevice}
          variant={isOn ? "destructive" : "default"}
          className="w-full h-12"
        >
          {isOn ? "Desligar Luz" : "Ligar Luz"}
          <Power className="ml-2 h-5 w-5" />
        </Button>

        {/* AGENDAMENTO */}
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
