"use client";

import { useState } from "react";
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

/* ---------------- MOCK ---------------- */

const luminosityHistoryMock = [
  { id: "1", user: "Sistema", action: "Ligou automaticamente", time: "06:00" },
  { id: "2", user: "Joel", action: "Desligou manualmente", time: "10:15" },
  { id: "3", user: "Sistema", action: "Desligou automaticamente", time: "18:00" },
];

export default function LuminosityPage() {
  // vindo do backend futuramente
  const [isOn, setIsOn] = useState(true);

  const [autoMode, setAutoMode] = useState(true);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [onTime, setOnTime] = useState("06:00");
  const [offTime, setOffTime] = useState("18:00");

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
                {statusLabel}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="px-6">
              <CardDescription>Modo de operação</CardDescription>
              <CardTitle className="text-2xl">
                {autoMode ? "Automático" : "Manual"}
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
            data={luminosityHistoryMock}
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
          <Switch checked={autoMode} onCheckedChange={setAutoMode} />
        </div>

        <Button
          onClick={() => setIsOn((prev) => !prev)}
          disabled={autoMode}
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
                onClick={() => {
                  console.log("Auto ON:", onTime, "Auto OFF:", offTime);
                  setScheduleOpen(false);
                }}
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
