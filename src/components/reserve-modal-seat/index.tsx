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
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import "@/components/reserve-modal-seat/datatime-custom.css";
import { HTTPError } from "ky";
import { getAuthToken } from "@/auth/cookie-auth";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUsers } from "@/http/get-users";
import { UpdateSeat } from "@/http/update-seat";
import { SeatResponseData } from "@/http/get-seats";

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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { data: users, isLoading: isUsersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CoworkingSpaceSchema>({
    resolver: zodResolver(addCoworkingSpaceSchema),
    defaultValues: {
      busy: false,
    },
  });

  const queryClient = useQueryClient();
  const { mutateAsync: updateSeat } = useMutation({
    mutationFn: UpdateSeat,
    async onSuccess(_, data) {
      queryClient.setQueryData<SeatResponseData[]>(["seats"], (oldData:any) => {
        if (!oldData) return [];
        return oldData.map((seat:any) =>
          seat.id === seatId
            ? { ...seat, busy: data.busy, seatOwnerId: data.seatOwnerId }
            : seat
        );
      });
    },
  });

  const handleReserveModalSeat = async (data: CoworkingSpaceSchema) => {
    
    try {
      await updateSeat({
        seatOwnerId: data.seatOwnerId,
        busy: data.busy,
        seatId,
        startTime: data.startTime,
        endTime: data.endTime,
        coworkingId,
      });
      toast.success("Espaço reservado com sucesso");
      onClose();
    } catch (error) {
      if (error instanceof HTTPError) {
        const { message } = await error.response.json();
       setError("root", {
         message: message
       })
        toast.error(message);
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
                      {isUsersLoading ? (
                        <SelectItem value="id">Carregando...</SelectItem>
                      ) : !users || users.length === 0 ? (
                        <SelectItem value="id">Carregando</SelectItem>
                      ) : (
                        users.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name}
                          </SelectItem>
                        ))
                      )}
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
            {errors.root && (
              <div className="text-red-500 text-sm mt-2">{errors.root.message}</div>
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
