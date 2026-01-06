import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";

export function SectionCards() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="sm:min-w-[150px] lg:min-w-[180px]">
        <CardHeader className="flex flex-col justify-center items-center px-0">
          <CardDescription>Temp. Atual</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            21º
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="flex flex-col justify-center lg:min-w-[180px]">
        <CardHeader className="flex flex-col justify-center items-center px-0">
          <CardDescription>Umidade Atual</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            20%
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="flex flex-col justify-center lg:min-w-[180px]">
        <CardHeader className="flex flex-col justify-center items-center px-0">
          <CardDescription>Nível do reservatório</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            2,3L
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="flex flex-col justify-center lg:min-w-[180px]">
        <CardHeader className="flex flex-col justify-center items-center px-0">
          <CardDescription>Total de Galinhas</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            23
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
