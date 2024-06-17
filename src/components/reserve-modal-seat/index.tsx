import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { z } from "zod";
import { fetchWrapper } from "@/lib/fetch";
import { Switch } from "../ui/switch";
import { useUser } from "@/context/UserContext";


interface EspacoCardProps {
  onClose: () => void;
  seatId: string;
}

const addCoworkingSpaceSchema = z.object({
  seatOwner : z.string().min(1, { message: "Nome obrigatório" }),
  busy: z.boolean().optional(),
});

type CoworkingSpaceSchema = z.infer<typeof addCoworkingSpaceSchema>;

export function ReserveModalSeat ({ onClose, seatId }: EspacoCardProps) {
  const {users} = useUser();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CoworkingSpaceSchema>({
    resolver: zodResolver(addCoworkingSpaceSchema),
    defaultValues: {
      busy: false
    }
  });

  const handleReserveModalSeat = async (data: CoworkingSpaceSchema) => {
    const init : RequestInit = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        seatOwner: data.seatOwner,
        busy: data.busy,
        id: seatId
      }),
    }
    try {
        await fetchWrapper("/api/coworking/update-seat", init);
    } catch (error) {   
        console.error("Error:", error);
    }
    onClose();
    };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Reservar Espaço</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleReserveModalSeat)}>
          <div className="grid w-full items-center gap-6">
            <div className="flex flex-col space-y-1.5">
              <Label className="text-start mb-4" htmlFor="espaco">Usuario</Label>
              <Controller
                name="seatOwner"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger id="espaco">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                     {users.map((user) => (
                       <SelectItem key={user.id} value={user.name}>{user.name}</SelectItem>
                     ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.seatOwner && <span>{errors.seatOwner.message}</span>}
              
            </div>
            <Controller
              name="busy"
              control={control}
              render={({ field }) => (
                <div className="flex items-center justify-between">
                  <span>Reservar Espaço</span>
                  <Switch
                    checked={field.value || false}
                    onCheckedChange={field.onChange}
                    className="bg-white" />
                </div>

              )}
            />
           
        <CardFooter className="flex items-center justify-items-center mt-4">
            <Button type="submit"  className="w-full">Reservar</Button>
        </CardFooter>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
