/**
 * TEMPLATE DE PÁGINA INTEGRADA
 * 
 * Este é um exemplo de como integrar uma página com a API real.
 * Copie este padrão para water.tsx, food.tsx e luminosity.tsx
 */

"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Progress } from "@/src/components/ui/progress";
import { useSensors } from "@/src/hooks/use-sensors";
import { useActions } from "@/src/hooks/use-actions";
import { ActionsTable } from "@/src/components/shared/actions-table";

interface PageAction {
  id: string;
  user: string;
  quantity: string;
  time: string;
}

export default function TemplateSystemPage() {
  const { currentData, loading, error } = useSensors();
  const { actions: apiActions, create: createAction } = useActions();
  const [pageActions, setPageActions] = useState<PageAction[]>([]);
  const [systemLoading, setSystemLoading] = useState(false);

  // Mapear dados da API para o formato da página
  useEffect(() => {
    if (apiActions && apiActions.length > 0) {
      const mapped: PageAction[] = apiActions.map((action) => ({
        id: action.id,
        user: action.user?.name || "Sistema",
        quantity: `${action.quantity}`,
        time: new Date(action.createdAt || "").toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));
      setPageActions(mapped);
    }
  }, [apiActions]);

  // Buscar ações ao montar
  useEffect(() => {
    // Buscar ações específicas do sistema
    // await actionsService.listAll('water', 10, 0);
  }, []);

  const handleSystemAction = async () => {
    try {
      setSystemLoading(true);
      // Exemplo: liberar água
      await createAction({
        userId: "current-user-id", // Substituir com ID real do usuário
        system: "water", // Mudar conforme o sistema
        action: "Liberação manual",
        quantity: 500,
      });
      // Atualizar lista de ações
    } catch (err) {
      console.error("Erro ao executar ação:", err);
    } finally {
      setSystemLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6 px-4 md:px-8 py-4 w-full">
        <h1 className="text-2xl font-semibold">Sistema</h1>
        <Card className="animate-pulse">
          <CardHeader>Carregando...</CardHeader>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6 px-4 md:px-8 py-4 w-full">
        <h1 className="text-2xl font-semibold">Sistema</h1>
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardDescription className="text-red-700">{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-2rem)] gap-6 px-4 md:px-8 py-4 pb-10 w-full lg:max-w-5xl">
      <h1 className="text-2xl font-semibold">Sistema</h1>

      {/* Cards de Status */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader className="px-6">
            <CardDescription>Valor atual</CardDescription>
            <CardTitle className="text-2xl tabular-nums">
              {currentData?.temperature ?? "--"}
            </CardTitle>
            <Progress value={50} className="mt-4 h-3" />
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="px-6">
            <CardDescription>Status</CardDescription>
            <CardTitle className="text-2xl text-green-500">Normal</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Gráfico de Histórico */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Histórico</CardTitle>
          <CardDescription>Últimas leituras</CardDescription>
        </CardHeader>
        <div className="p-6 pt-0">
          {/* Adicionar gráfico similar ao temperatura-chart.tsx */}
          <p className="text-gray-500">Gráfico de histórico aqui</p>
        </div>
      </Card>

      {/* Tabela de Ações */}
      <div className="overflow-x-auto">
        <ActionsTable
          title="Histórico de Ações"
          columns={[
            { accessorKey: "user", header: "Usuário" },
            { accessorKey: "quantity", header: "Quantidade" },
            { accessorKey: "time", header: "Horário" },
          ]}
          data={pageActions}
        />
      </div>

      <div className="flex-1" />

      {/* Botão de Ação */}
      <div className="w-full pb-6 md:pb-12 mt-4">
        <Button
          onClick={handleSystemAction}
          disabled={systemLoading || error !== null}
          className="cursor-pointer w-full h-12 text-base"
        >
          {systemLoading ? "Processando..." : "Executar Ação"}
        </Button>
      </div>
    </div>
  );
}
