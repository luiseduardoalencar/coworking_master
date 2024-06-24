import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Switch } from "../ui/switch";
import { useUser } from "@/context/UserContext";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import "@/components/reserve-modal-seat/datatime-custom.css";
import { api } from "@/http/api-client";
import { HTTPError } from "ky";
import { getAuthToken } from "@/auth/cookie-auth";

interface EspacoCardProps {
  onClose: () => void;
  coworkingId: string;
  seatId: string;
}

const addCoworkingSpaceSchema = z.object({
  seatOwnerId: z.string().min(1, { message: "Nome obrigatório" }),
  busy: z.boolean().optional(),
  startTime: z.string(),
  endTime: z.string(),
});

type CoworkingSpaceSchema = z.infer<typeof addCoworkingSpaceSchema>;

export function ReserveModalSeat({
  onClose,
  seatId,
  coworkingId,
}: EspacoCardProps) {
  const { users } = useUser();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CoworkingSpaceSchema>({
    resolver: zodResolver(addCoworkingSpaceSchema),
    defaultValues: {
      busy: false,
    },
  });

  const handleReserveModalSeat = async (data: CoworkingSpaceSchema) => {
    const token = await getAuthToken();
   
    
    try {
      await api.put("/api/coworking/update-seat", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        json: {
          seatOwnerId: data.seatOwnerId,
          busy: data.busy,
          id: seatId,
          startTime: data.startTime,
          endTime: data.endTime,
          coworkingId,
        },
      });

      onClose();
    } catch (error) {
      if (error instanceof HTTPError) {
        const { message } = await error.response.json();
        setErrorMessage(message);
      }
      console.error("Error:", error);
    }
  };

  const today = new Date();

  return (
    <Card className="w-[400px] rounded border-none">
      <CardHeader>
        <CardTitle className="text-gray-300">Reservar Espaço</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleReserveModalSeat)}>
          <div className="grid w-full items-center gap-6">
            <div className="flex flex-col space-y-1.5">
              <Label className="text-start mb-4" htmlFor="espaco">
                Usuário
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
              name="startTime"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col space-y-1.5">
                  <Label className="text-start mb-4" htmlFor="date">
                    Horário de Início
                  </Label>
                  <Datetime
                    value={field.value ? new Date(field.value) : today}
                    onChange={(date) => field.onChange(date.toString())}
                    dateFormat="DD/MM/YYYY"
                    timeFormat="HH:mm"
                    isValidDate={(current) => current.isAfter(today)}
                    inputProps={{ placeholder: "Selecione a data e hora" }}
                    className="rd-container"
                  />
                  {/* {errors.bookingDate && (
                    <span>{errors.bookingDate.message}</span>
                  )} */}
                </div>
              )}
            />
            <Controller
              name="endTime"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col space-y-1.5">
                  <Label className="text-start mb-4" htmlFor="date">
                    Horário de Fim
                  </Label>
                  <Datetime
                    value={field.value ? new Date(field.value) : today}
                    onChange={(date) => field.onChange(date.toString())}
                    dateFormat="DD/MM/YYYY"
                    timeFormat="HH:mm"
                    isValidDate={(current) => current.isAfter(today)}
                    inputProps={{ placeholder: "Selecione a data e hora" }}
                    className="rd-container"
                  />
                  {/* {errors.bookingDate && (
                    <span>{errors.bookingDate.message}</span>
                  )} */}
                </div>
              )}
            />
            {errorMessage && (
              <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
            )}
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
