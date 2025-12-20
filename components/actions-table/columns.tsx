"use client";

import { ColumnDef } from "@tanstack/react-table";

type Action = {
  id: string;
  sector: string;
  status: "abastecido" | "desligado" | "ligado" | "acendido" | "apagado";
  dateTime: string;
};

export const columns: ColumnDef<Action>[] = [
  {
    accessorKey: "sector",
    header: "Setor",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "dateTime",
    header: "Horário",
  },
];
