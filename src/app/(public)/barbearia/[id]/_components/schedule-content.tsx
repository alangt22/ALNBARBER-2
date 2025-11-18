"use client";
import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import imgTeste from "../../../../../../public/foto1.png";
import { Loader, MapPin } from "lucide-react";
import { Prisma } from "@prisma/client";
import { useAppoitmentForm, AppointmentFormData } from "./schedule-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { formatPhone } from "@/utils/formatPhone";
import { DateTimePicker } from "./date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScheduleTimeList } from "./schedule-time-list";
import { createNewAppointment } from "../_actions/create-appointments";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { FaWhatsapp } from "react-icons/fa";

type UserWithServiceAndSubscription = Prisma.UserGetPayload<{
  include: {
    subscription: true;
    services: true;
  };
}>;

interface ScheduleContentProps {
  clinic: UserWithServiceAndSubscription;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export function ScheduleContent({ clinic }: ScheduleContentProps) {
  const form = useAppoitmentForm();
  const { watch } = form;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [appointmentData, setAppointmentData] = useState<any>(null);

  const selectedDAte = watch("date");
  const selectedServiceId = watch("serviceId");

  const [selectedTime, setSelectedTime] = useState("");
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [blockedTimes, setBlockedTimes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBlockedTimes = useCallback(
    async (date: Date): Promise<string[]> => {
      setLoadingSlots(true);
      try {
        const dateString = date.toISOString().split("T")[0];
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/api/schedule/get-appointments?userId=${clinic.id}&date=${dateString}`
        );
        const json = await response.json();
        setLoadingSlots(false);
        return json;
      } catch (error) {
        setLoadingSlots(false);
        return [];
      }
    },
    [clinic.id]
  );

  useEffect(() => {
    if (selectedDAte) {
      fetchBlockedTimes(selectedDAte).then((blocked) => {
        setBlockedTimes(blocked);
        const times = clinic.times || [];
        const finalSlot = times.map((time) => ({
          time: time,
          available: !blocked.includes(time),
        }));
        setAvailableTimeSlots(finalSlot);
        const stillAvailable = finalSlot.find(
          (slot) => slot.time === selectedTime && slot.available
        );
        if (!stillAvailable) setSelectedTime("");
      });
    }
  }, [selectedDAte, clinic.times, fetchBlockedTimes, selectedTime]);

  async function handleRegisterAppointment(formData: AppointmentFormData) {
    setIsLoading(true);
    if (!selectedTime) return;

    const response = await createNewAppointment({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      time: selectedTime,
      date: formData.date,
      serviceId: formData.serviceId,
      clinicId: clinic.id,
      barberName: formData.barberName,
    });

    if (response.error) {
      toast.error(response.error);
      setIsLoading(false);
      return;
    }

    // 👉 Salva os dados para exibir no dialog
    setAppointmentData({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      time: selectedTime,
      date: formData.date,
      service: clinic.services.find((s) => s.id === formData.serviceId)?.name,
      barber: formData.barberName,
      clinicName: clinic.name,
    });

    // 👉 Abre o modal
    setIsDialogOpen(true);

    // ❗ Mantenha o toast do WhatsApp se quiser:
    toast.success(
      <div>
        <a
          target="_blank"
          href={`https://wa.me/+55${clinic.phone?.replace(
            /\D/g,
            ""
          )}?text=Olá!%0A%0ADesejo confirmar o meu agendamento.`}
        >
          Agendamento confirmado!
        </a>
      </div>,
      {
        duration: 5000,
        closeButton: true,
        position: "top-right",
        style: {
          borderRadius: "10px",
          background: "#0cde7c",
          color: "#fff",
        },
      }
    );

    form.reset();
    setSelectedTime("");
    setIsLoading(false);
  }

  // dias bloqueados
  const dayMap: Record<string, number> = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };

  const allowedDays = clinic.workingDays.map(
    (day) => dayMap[day.toLowerCase()]
  );

  return (
    <div className="min-h-screen flex flex-col">
      <div className="h-32 w-full" />

      <section className="container mx-auto px-4 -mt-16">
        <div className="max-w-2xl mx-auto">
          <article className="flex flex-col items-center">
            <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 mb-8">
              <Image
                src={clinic.image ? clinic.image : imgTeste}
                alt="Foto da clinica"
                className="object-cover"
                fill
              />
            </div>
            <h1 className="text-2xl font-bold mb-2">{clinic.name}</h1>
            <div className="flex items-center gap-1">
              <MapPin className="w-5 h-5" />
              <span>{clinic.adress || "Endereço não informado"}</span>
            </div>
          </article>
        </div>
      </section>

      <section className="max-w-2xl mx-auto w-full mt-6 mb-16">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleRegisterAppointment)}
            className="mx-2 space-y-6 p-6 border rounded-md shadow-sm bg-[#2b2b2b]"
          >
            {/* Nome */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="my-2">
                  <FormLabel className="font-semibold">
                    Nome completo:
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite seu nome completo..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="my-2">
                  <FormLabel className="font-semibold">Email:</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite seu email..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Telefone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="my-2">
                  <FormLabel className="font-semibold">Telefone:</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="(XX) XXXXX-XXXX"
                      {...field}
                      onChange={(e) =>
                        field.onChange(formatPhone(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Data */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-1">
                  <FormLabel className="font-semibold">
                    Data do agendamento:
                  </FormLabel>
                  <FormControl>
                    <DateTimePicker
                      initialDate={new Date()}
                      className="w-full rounded border p-2"
                      allowedDays={allowedDays}
                      onChange={(date) => {
                        if (date) {
                          field.onChange(date);
                          setSelectedTime("");
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Serviço */}
            <FormField
              control={form.control}
              name="serviceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">
                    Selecione o serviço:
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedTime("");
                      }}
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um serviço" />
                      </SelectTrigger>
                      <SelectContent>
                        {clinic.services.map((service) => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.name} ({Math.floor(service.duration / 60)}h{" "}
                            {service.duration % 60}min)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Barbeiro */}
            {clinic.barbers.length > 0 && (
              <FormField
                control={form.control}
                name="barberName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">
                      Selecione o barbeiro:
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(value)}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um barbeiro" />
                        </SelectTrigger>
                        <SelectContent>
                          {clinic.barbers.map((barber) => (
                            <SelectItem key={barber} value={barber}>
                              {barber}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Horários disponíveis */}
            {selectedServiceId && (
              <div className="space-y-2">
                <Label className="font-semibold">Horários disponíveis:</Label>
                <div className="flex gap-5">
                  <div>
                    <div className="border-red-600 border-2 h-8 w-12 rounded-md mt-8"></div>
                    <span className="text-[12px] font-bold">Ocupado</span>
                  </div>
                  <div>
                    <div className="border h-8 w-12 rounded-md mt-8 bg-[#28282d]"></div>
                    <span className="text-[12px] font-bold">Disponível</span>
                  </div>
                  <div>
                    <div className="border-green-600 border-2 h-8 w-12 rounded-md mt-8"></div>
                    <span className="text-[12px] font-bold">Selecionado</span>
                  </div>
                </div>
                <div className=" p-4 rounded-lg mt-4">
                  {loadingSlots ? (
                    <p>Carregando horários...</p>
                  ) : availableTimeSlots.length === 0 ? (
                    <p>Nenhum horário disponível</p>
                  ) : (
                    <ScheduleTimeList
                      onSelectTime={(time) => setSelectedTime(time)}
                      clinicTimes={clinic.times}
                      blockedTimes={blockedTimes}
                      availableTimeSlots={availableTimeSlots}
                      selectedTime={selectedTime}
                      selecedDate={selectedDAte}
                      requiredSlots={
                        clinic.services.find((s) => s.id === selectedServiceId)
                          ? Math.ceil(
                              clinic.services.find(
                                (s) => s.id === selectedServiceId
                              )!.duration / 30
                            )
                          : 1
                      }
                    />
                  )}
                </div>
              </div>
            )}

            {/* Botão */}
            {clinic.status ? (
              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-900 cursor-pointer"
                disabled={
                  isLoading ||
                  !watch("name") ||
                  !watch("email") ||
                  !watch("phone") ||
                  !watch("date") ||
                  !selectedTime ||
                  !watch("barberName")
                }
              >
                {isLoading ? (
                  <span className="w-24 flex items-center justify-center">
                    <Loader className="animate-spin" />
                  </span>
                ) : (
                  "Realizar agendamento"
                )}
              </Button>
            ) : (
              <p className="bg-red-500 text-white text-center px-4 py-2 rounded-md">
                A clínica está fechada nesse momento
              </p>
            )}
          </form>
        </Form>
      </section>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#2b2b2b] text-white border border-white/10">
          <DialogHeader>
            <DialogTitle>Agendamento realizado!</DialogTitle>
            <DialogDescription className="text-gray-300">
              Confira os detalhes do seu agendamento:
            </DialogDescription>
          </DialogHeader>

          {appointmentData && (
            <div className="py-4 space-y-2">
              <p className="text-gray-400">
                <span className="font-bold text-white">Nome:</span>{" "}
                {appointmentData.name}
              </p>
              <div>
                <p className="text-gray-400">
                  <span className="font-bold text-white">Barbearia:</span>{" "}
                  {appointmentData.clinicName}
                </p>
                <p className="text-gray-400">
                  <span className="font-bold text-white">Serviço:</span>{" "}
                  {appointmentData.service}
                </p>
                <p className="text-gray-400">
                  <span className="font-bold text-white">Barbeiro:</span>{" "}
                  {appointmentData.barber}
                </p>
              </div>
              <div>
                <p className="text-gray-400">
                  <span className="font-bold text-white">Data:</span>{" "}
                  {appointmentData.date.toLocaleDateString()}
                </p>
                <p className="text-gray-400">
                  <span className="font-bold text-white">Horário:</span>{" "}
                  {appointmentData.time}
                </p>
                <p className="text-gray-400">
                  <span className="font-bold text-white">
                    Telefone da Barbearia:{" "}
                  </span>
                  {clinic.phone}
                </p>
              </div>

              <div className="flex items-center pt-2">
                <FaWhatsapp className="text-green-400 w-5 h-5" />

                <a
                  className="text-green-400 hover:text-green-200 px-2"
                  target="_blank"
                  href={`https://wa.me/+55${clinic.phone?.replace(
                    /\D/g,
                    ""
                  )}?text=Olá!%0A%0ADesejo confirmar o meu agendamento.`}
                >
                  Confirme seu agendamento aqui
                </a>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              onClick={() => setIsDialogOpen(false)}
              className="w-full bg-blue-600 hover:bg-blue-800"
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
