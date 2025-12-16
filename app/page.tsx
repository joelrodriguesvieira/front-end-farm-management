import { SectionCards } from "@/components/section-cards";

export default function Home() {
  return (
    <div className="flex flex-col gap-6 px-8 py-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <SectionCards />
    </div>
  );
}
