import { ActionsTable } from "@/src/components/shared/actions-table";
import { dashboardColumns, DashboardTableColumns } from "@/src/app/(dashboard)/components/columns";
import { SectionCards } from "@/src/app/(dashboard)/components/section-cards";

export default function Home() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  const homeData: DashboardTableColumns[] = [
    {
      id: "728ed52f",
      sector: "Alimentação",
      status: "abastecido",
      dateTime: `${hours}:${minutes}:${seconds}`,
    },
    {
      id: "489e1d42",
      sector: "Iluminação",
      status: "acendido",
      dateTime: `${hours}:${minutes}:${seconds}`,
    },
  ];

  return (
    <div className="flex flex-col gap-6 px-4 md:px-8 py-4 w-full lg:max-w-5xl">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <SectionCards />
      <div className="overflow-x-auto">
        {" "}
        <ActionsTable
          columns={dashboardColumns}
          data={homeData}
          title="Últimas Ações"
        />
      </div>
    </div>
  );
}
