type Action = {
    id: string
    sector: string
    status: "abastecido" | "desligado" | "ligado" | "acendido" | "apagado"
    dateTime: string
}

const now = new Date();

const hours = now.getHours();
const minutes = now.getMinutes();
const seconds = now.getSeconds();



import { columns } from "./columns"
import { DataTable } from "./data-table"

// async function getData(): Promise<Action[]> {
//   // Fetch data from your API here.
//   return [
//     {
//       id: "728ed52f",
//       amount: 100,
//       status: "pending",
//       email: "m@example.com",
//     },
//     // ...
//   ]
// }

export default async function DemoPage() {
//   const data = await getData()

  const data: Action[] = [
    {
        id: "728ed52f",
        sector: 'Alimentação',
        status: "abastecido",
        dateTime: `${hours}:${minutes}:${seconds}`,
    },
    {
        id: "489e1d42",
        sector: "Iluminação",
        status: "acendido",
        dateTime: `${hours}:${minutes}:${seconds}`,
    },
]

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}