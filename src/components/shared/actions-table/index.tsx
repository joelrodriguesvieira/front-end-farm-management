import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./data-table";

interface ActionsTableProps<TData> {
  columns: ColumnDef<TData, any>[];
  data: TData[];
  title?: string;
}

export function ActionsTable<TData>({ 
  columns, 
  data, 
  title 
}: ActionsTableProps<TData>) {
  return (
    <div className="w-full space-y-4">
      {title && <h2 className="text-xl font-bold">{title}</h2>}
      <DataTable columns={columns} data={data} />
    </div>
  );
}