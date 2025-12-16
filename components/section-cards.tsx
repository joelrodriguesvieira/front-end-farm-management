
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SectionCards() {
  return (
    <div className="flex gap-6">

      <Card className="flex flex-col justify-center lg:min-w-[230px]">
        <CardHeader>
          <CardDescription>Temp. Atual</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            21º
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="lg:min-w-[230px]">
        <CardHeader>
          <CardDescription>Umidade Atual</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            20%
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="lg:min-w-[230px]">
        <CardHeader>
          <CardDescription>Nível do reservatório</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            2,3L
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="lg:min-w-[230px]">
        <CardHeader>
          <CardDescription>Total de Galinhas</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            23
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  )
}
