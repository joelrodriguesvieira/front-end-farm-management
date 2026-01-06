import { DefaultTableColumns } from "@/src/types/default-table-columns";
import { ColumnDef } from "@tanstack/react-table";

export interface FoodTableColumns extends DefaultTableColumns {
  user: string;
  quantity: string;
}

export const foodTableColumns: ColumnDef<FoodTableColumns>[] = [
  {
    accessorKey: "user",
    header: "Usuário",
  },
  {
    accessorKey: "quantity",
    header: "Quantidade",
  },
  {
    accessorKey: "dateTime",
    header: "Horário",
  },
];
