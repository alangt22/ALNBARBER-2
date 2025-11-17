"use client";

import { use, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Prisma } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { X, Eye, Octagon, Loader } from "lucide-react";
import { cancelAppointment } from "../../_actions/cancel-appointment";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogAppointments } from "./dialog-appointments";
import { ButtonPickerAppointment } from "./button-date";

export type AppointmentWithService = Prisma.AppoitmentsGetPayload<{
  include: {
    service: true;
  };
}>;

interface AppointmentsListProps {
  times: string[];
}

export function AppointmentList({ times }: AppointmentsListProps) {
  const seachParams = useSearchParams();
  const date = seachParams.get("date");
  const queryClient = useQueryClient();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<string | null>(
    null
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [detailAppointment, setDetailAppointment] =
    useState<AppointmentWithService | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["get-appointments", date],
    queryFn: async () => {
      let activeDate = date;

      if (!activeDate) {
        const today = format(new Date(), "yyyy-MM-dd");
        activeDate = today;
      }

      const url = `${process.env.NEXT_PUBLIC_URL}/api/clinic/appointments?date=${activeDate}`;

      const response = await fetch(url);

      const json = (await response.json()) as AppointmentWithService[];

      console.log(json);

      if (!response.ok) {
        return [];
      }

      return json;
    },
    staleTime: 20000,
    refetchInterval: 60000,
  });

  // preenchendo a lista com os horarios agendados
  const occupaantMap: Record<string, AppointmentWithService> = {};

  if (data && data.length > 0) {
    for (const appointment of data) {
      // Calcular slots necessarios
      const requiredSlots = Math.ceil(appointment.service.duration / 30);

      // onde inicia os agendamentos
      const startIndex = times.indexOf(appointment.time);

      // Percorrer com base quantos slots sao necessarios
      // se encontrou
      if (startIndex !== -1) {
        for (let i = 0; i < requiredSlots; i++) {
          const slotIndex = startIndex + i;

          if (slotIndex < times.length) {
            occupaantMap[times[slotIndex]] = appointment;
          }
        }
      }
    }
  }

  async function handleCancelAppointment(appointmentId: string) {
    const response = await cancelAppointment({ appointmentId: appointmentId });

    if (response.error) {
      toast.error(response.error);
      return;
    }

    queryClient.invalidateQueries({ queryKey: ["get-appointments"] });
    await refetch();
    toast.success(response.data);
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl md:text-2xl font-bold">
            Agendamentos
          </CardTitle>
          <ButtonPickerAppointment />
        </CardHeader>

        <CardContent>
          <ScrollArea className="h-[calc(100vh-20rem)] lg:h-[calc(100vh-15rem)] pr-4">
            {isLoading ? (
              <div>
                <p>Carregando agenda...</p>
                <Loader
                  size={16}
                  color="#131313"
                  className="animate-spin flex text-center"
                />
              </div>
            ) : (
              times.map((slot) => {
                const occupant = occupaantMap[slot];

                if (occupant) {
                  return (
                    <div
                      key={slot}
                      className="flex items-center py-2 border-t last:border-b"
                    >
                      <div className="w-16 text-sm font-semibold">{slot}</div>
                      <div className="flex-1 text-sm">
                        <div className="font-semibold">{occupant.name}</div>
                        <div className="text-sm text-gray-500">
                          {occupant.phone}
                        </div>
                      </div>

                      <div className="ml-auto">
                        <div className="flex">
                          <DialogTrigger asChild>
                            <Button
                              className="cursor-pointer"
                              variant="ghost"
                              size="icon"
                              onClick={() => setDetailAppointment(occupant)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>

                          <Button
                            className="cursor-pointer"
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setAppointmentToDelete(occupant.id);
                              setConfirmDelete(true);
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={slot}
                    className="flex items-center py-2 border-t last:border-b"
                  >
                    <div className="w-16 text-sm font-semibold">{slot}</div>
                    <div className="flex-1 text-sm text-gray-500">
                      Disponivel
                    </div>
                  </div>
                );
              })
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      <DialogAppointments appointment={detailAppointment} />
      {/* Dialog de confirmação de exclusão */}
      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir agendamento</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este agendamento?
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setConfirmDelete(false)}>
              Cancelar
            </Button>

            <Button
              className="cursor-pointer"
              variant="destructive"
              onClick={async () => {
                if (appointmentToDelete) {
                  await handleCancelAppointment(appointmentToDelete);
                }
                setConfirmDelete(false);
              }}
            >
              Confirmar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
