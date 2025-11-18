"use client";

import { useState } from "react";
import { ProfileFormData, useProfileForm } from "./profile-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader } from "lucide-react";

import { cn } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import { updateProfile } from "../_actions/update-profile";
import { toast } from "sonner";
import { formatPhone } from "@/utils/formatPhone";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AvatarProfile } from "./profile-avatar";
import { DaysSelector } from "./day-selector";

type UserWithSubscription = Prisma.UserGetPayload<{
  include: {
    subscription: true;
  };
}>;

interface ProfileContentProps {
  user: UserWithSubscription;
}

export function ProfileContent({ user }: ProfileContentProps) {
  const router = useRouter();
  const [selectedHours, setSelectedHours] = useState<string[]>(
    user.times ?? []
  );
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);

  const [barberName, setBarberName] = useState(""); // input temporário
  const [barbersList, setBarbersList] = useState<string[]>(user.barbers || []); // lista de barbers

  const [selectedDays, setSelectedDays] = useState<string[]>([
    ...user.workingDays,
  ]);

  const { update } = useSession();

  const form = useProfileForm({
    name: user.name,
    adress: user.adress,
    phone: user.phone,
    status: user.status,
    timeZone: user.timeZone,
    barbers: user.barbers,
    workingDays: user.workingDays,
  });

  // Funções para adicionar/remover barbers
  function addBarber() {
    if (barberName.trim() === "") return;
    setBarbersList((prev) => [...prev, barberName.trim()]);
    setBarberName("");
  }

  function removeBarber(name: string) {
    setBarbersList((prev) => prev.filter((b) => b !== name));
  }

  function generateTimesSlots(): string[] {
    const hours: string[] = [];
    for (let i = 8; i <= 24; i++) {
      for (let j = 0; j < 2; j++) {
        const hour = i.toString().padStart(2, "0");
        const minute = (j * 30).toString().padStart(2, "0");
        hours.push(`${hour}:${minute}`);
      }
    }
    return hours;
  }

  const hours = generateTimesSlots();

  function toggleHour(hour: string) {
    setSelectedHours((prev) =>
      prev.includes(hour)
        ? prev.filter((h) => h !== hour)
        : [...prev, hour].sort()
    );
  }

  const timeZone = Intl.supportedValuesOf("timeZone").filter(
    (zone) =>
      zone.startsWith("America/Sao_Paulo") ||
      zone.startsWith("America/Fortaleza") ||
      zone.startsWith("America/Recife") ||
      zone.startsWith("America/Bahia") ||
      zone.startsWith("America/Belem") ||
      zone.startsWith("America/Manaus") ||
      zone.startsWith("America/Cuiaba") ||
      zone.startsWith("America/Boa_Vista")
  );

  const handleDaysChange = (days: string[]) => {
    setSelectedDays(days);
    form.setValue("workingDays", days);
  };

  async function onSubmit(values: ProfileFormData) {
    setIsLoading(true);

    const response = await updateProfile({
      name: values.name,
      adress: values.adress,
      phone: values.phone,
      status: values.status === "active" ? true : false,
      timeZone: values.timeZone,
      times: selectedHours || [],
      barbers: barbersList,
      workingDays: selectedDays
    });

    if (response.error) {
      toast.error(response.error);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    toast.success(response.data);
  }

  async function handleLogout() {
    setIsLogoutLoading(true);
    await signOut();
    await update();
    router.replace("/");
    setIsLogoutLoading(false);
  }

  return (
    <div className="mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Meu Perfil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <AvatarProfile avatarUrl={user.image} userId={user.id} />
              </div>

              <div className="space-y-4">
                {/* Nome */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Nome</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Digite o nome da clínica..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Endereço */}
                <FormField
                  control={form.control}
                  name="adress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Endereço completo:
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Digite o endereço da clínica..."
                        />
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
                    <FormItem>
                      <FormLabel className="font-semibold">Telefone</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="(11) 91234-5678"
                          onChange={(e) => {
                            const formatedValue = formatPhone(e.target.value);
                            field.onChange(formatedValue);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Status */}
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Status</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status da clínica" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">
                              ATIVO (aberto)
                            </SelectItem>
                            <SelectItem value="inactive">
                              INATIVO (fechado)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Input Barbers */}
                <FormItem>
                  <FormLabel className="font-semibold">Barbers</FormLabel>
                  <div className="flex space-x-2 mb-2">
                    <Input
                      value={barberName}
                      onChange={(e) => setBarberName(e.target.value)}
                      placeholder="Digite o nome do barber..."
                    />
                    <Button type="button" onClick={addBarber}>
                      Adicionar
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {barbersList.map((barber) => (
                      <span
                        key={barber}
                        className="px-2 py-1 rounded bg-[#000308] flex items-center space-x-1"
                      >
                        <span>{barber}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeBarber(barber)}
                        >
                          ✕
                        </Button>
                      </span>
                    ))}
                  </div>
                </FormItem>

                {/* Horários */}
                <div className="space-y-2">
                  <Label className="font-semibold">Configurar horários</Label>
                  <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
                    <DialogTrigger asChild>
                      <Button
                        value="outline"
                        className="w-full justify-between"
                      >
                        Clique aqui para selecionar horários
                        <ArrowRight className="w-5 h-5" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Horários</DialogTitle>
                      </DialogHeader>
                      <section className="py-4">
                        <p className="text-sm text-muted-foreground mb-2">
                          Clique nos horários abaixo para marcar ou desmarcar:
                        </p>
                        <div className="grid grid-cols-5 gap-2">
                          {hours.map((hour) => (
                            <Button
                              key={hour}
                              variant="outline"
                              className={cn(
                                "h-10",
                                selectedHours.includes(hour) &&
                                  "border-2 border-emerald-500 text-primary"
                              )}
                              onClick={() => toggleHour(hour)}
                            >
                              {hour}
                            </Button>
                          ))}
                        </div>
                      </section>
                      <Button
                        className="w-full"
                        onClick={() => setDialogIsOpen(false)}
                      >
                        Fechar modal
                      </Button>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    Dias de Funcionamento
                  </label>
                  <div className="rounded-lg border bg-card p-4">
                    <DaysSelector
                    // mostrar os dias vindo do banco
                      selectedDays={selectedDays}
                      onChange={handleDaysChange}
                    />
                  </div>
                </div>

                {/* Fuso horário */}
                <FormField
                  control={form.control}
                  name="timeZone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Selecione o fuso horário
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o seu fuso horário" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeZone.map((zone) => (
                              <SelectItem key={zone} value={zone}>
                                {zone}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-400 cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="w-44 flex items-center justify-center">
                      <Loader className="animate-spin" />
                    </span>
                  ) : (
                    "Salvar alterações"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>

      {/* Logout */}
      <section className="mt-4">
        <Button
          className="bg-red-500 hover:bg-red-300 cursor-pointer"
          onClick={handleLogout}
          disabled={isLogoutLoading}
        >
          {isLogoutLoading ? (
            <span className="w-24 flex items-center justify-center">
              <Loader className="animate-spin" />
            </span>
          ) : (
            "Sair da conta"
          )}
        </Button>
      </section>
    </div>
  );
}
