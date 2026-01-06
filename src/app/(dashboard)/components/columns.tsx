"use client";

import { DefaultTableColumns } from "@/src/types/default-table-columns";
import { ColumnDef } from "@tanstack/react-table";

export interface DashboardTableColumns extends DefaultTableColumns {
  sector: string;
}

export const dashboardColumns: ColumnDef<DashboardTableColumns>[] = [
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
