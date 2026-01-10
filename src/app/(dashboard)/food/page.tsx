"use client";

import { ActionsTable } from "@/src/components/shared/actions-table";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { foodTableColumns, FoodTableColumns } from "./components/columns";
import { Button } from "@/src/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Label } from "@/src/components/ui/label";
import { Input } from "@/src/components/ui/input";
import { useState } from "react";

export default function FoodPage() {
  const [quantity, setQuantity] = useState("");
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  const foodData: FoodTableColumns[] = [
    {
      id: "a1b2c3d4",
      user: "Joel",
      quantity: "20g",
      dateTime: `${hours}:${minutes}:${seconds}`,
    },
    {
      id: "a11111111",
      user: "Pedin",
      quantity: "30g",
      dateTime: `${hours}:${minutes}:${seconds}`,
    },
    {
      id: "adasdfdsfsdf",
      user: "Henrique",
      quantity: "60g",
      dateTime: `${hours}:${minutes}:${seconds}`,
    },
    {
      id: "434334534534",
      user: "Joel",
      quantity: "70g",
      dateTime: `${hours}:${minutes}:${seconds}`,
    },
  ];

  const handleAddFood = () => {
    console.log("Adicionando:", quantity);
    // Aqui você faria a chamada para sua API ou mutação
    setQuantity("");
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-2rem)] gap-6 px-4 md:px-8 py-4 pb-10 w-full lg:max-w-5xl">
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold">Alimentação</h1>

        <Card className="sm:min-w-[150px] lg:min-w-[180px]">
          <CardHeader className="flex flex-col justify-center items-center lg:items-start px-6">
            <CardDescription>Quantidade atual de comida</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">
              280g
            </CardTitle>
          </CardHeader>
        </Card>

        <div className="overflow-x-auto">
          <ActionsTable
            columns={foodTableColumns}
            data={foodData}
            title="Histórico de Abastecimento de Comida"
          />
        </div>
      </div>

      <div className="flex-1" />

      <Dialog>
        <DialogTrigger asChild>
          <div className="w-full pb-6 md:pb-12 mt-4">
            <Button
              variant="default"
              className="cursor-pointer w-full h-12 text-base"
            >
              Adicionar Comida <Plus className="ml-2 h-5 w-5 text-white" />
            </Button>
          </div>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px] w-[90%] rounded-2xl animate-in slide-in-from-bottom-4 duration-300">
          <DialogHeader>
            <DialogTitle className="text-center">Abastecer Comida</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label
                htmlFor="quantity"
                className="text-sm text-muted-foreground"
              >
                Quantidade (gramas)
              </Label>
              <Input
                id="quantity"
                type="number"
                placeholder="Ex: 50"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="h-12 text-lg"
              />
            </div>
            <Button onClick={handleAddFood} className="w-full h-12 mt-2">
              Adicionar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
