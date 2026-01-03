import ActionsTable from "@/src/components/shared/actions-table";
import { SectionCards } from "@/src/features/dashboard/section-cards";

export default function Home() {
  return (
    <div className="flex flex-col gap-6 px-4 md:px-8 py-4 w-full lg:max-w-5xl">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <SectionCards />
      <div className="overflow-x-auto">
        {" "}
        <ActionsTable />
      </div>
    </div>
  );
}
