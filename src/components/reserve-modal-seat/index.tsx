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
import { Calendar } from "../ui/calendar";
import { addDays, isBefore, parseISO } from "date-fns";


interface EspacoCardProps {
  onClose: () => void;
  coworkingId: string
  seatId: string
}

const addCoworkingSpaceSchema = z.object({
  seatOwnerId: z.string().min(1, { message: "Nome obrigatório" }),
  busy: z.boolean().optional(),
  bookingDate: z.string().refine((date) => {
    // Verifica se a data não é no passado
    const today = new Date();
    const selectedDate = parseISO(date);
    return !isBefore(selectedDate, today);
  }, { message: "Data não pode ser no passado" })
});

type CoworkingSpaceSchema = z.infer<typeof addCoworkingSpaceSchema>;

export function ReserveModalSeat({ onClose, seatId, coworkingId }: EspacoCardProps) {
  const { users } = useUser();
 
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CoworkingSpaceSchema>({
    resolver: zodResolver(addCoworkingSpaceSchema),
    defaultValues: {
      busy: false,
    },
  });

  const handleReserveModalSeat = async (data: CoworkingSpaceSchema) => {
    const bookingDate = new Date(data.bookingDate); 
    const init: RequestInit = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        seatOwnerId: data.seatOwnerId,
        busy: data.busy,
        id: seatId,
        bookingDate,
        coworkingId
      }),
    };
    try {
      await fetchWrapper("/api/coworking/update-seat", init);
    } catch (error) {
      console.error("Error:", error);
    }
    console.log(data.bookingDate);
    
    onClose();
  };
  const today = new Date();
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Reservar Espaço</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleReserveModalSeat)}>
          <div className="grid w-full items-center gap-6">
            <div className="flex flex-col space-y-1.5">
              <Label className="text-start mb-4" htmlFor="espaco">
                Usuario
              </Label>
              <Controller
                name="seatOwnerId"
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
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.seatOwnerId && <span>{errors.seatOwnerId.message}</span>}
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
                    className="bg-white"
                  />
                </div>
              )}
            />
           <Controller
              name="bookingDate"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col space-y-1.5">
                  <Label className="text-start mb-4" htmlFor="date">
                    Data da Reserva
                  </Label>
                  <Calendar
                    mode="single"
                    selected={field.value ? parseISO(field.value) : today}
                    onSelect={(date) => field.onChange(date ? date.toISOString() : '')}
                    disabled={(date) => isBefore(date, today)} // Desabilita datas passadas
                    className="rounded-md border"
                  />
                  {errors.bookingDate && (
                    <span>{errors.bookingDate.message}</span>
                  )}
                </div>
              )}
            />
            <CardFooter className="flex items-center justify-items-center mt-4">
              <Button type="submit" className="w-full">
                Reservar
              </Button>
            </CardFooter>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
