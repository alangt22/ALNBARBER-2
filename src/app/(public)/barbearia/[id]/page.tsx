import { redirect } from "next/navigation";
import { getInfoSchedule } from "./_data-access/get-info-schedule";
import { ScheduleContent } from "./_components/schedule-content";
import { Metadata } from "next";

interface SchedulePageProps {
  params: { id: string };
}

// Função dinâmica para gerar metadata
export async function generateMetadata({
    params,
} : {
    params: Promise<{ id: string}>
}) {
  const userId = (await params).id;
  const user = await getInfoSchedule({ userId });

  if (!user) {
    return {
      title: "ALNBarber",
      description: "Painel de controle - ALNBarber",
    };
  }

  return {
    title: `ALNBarber - ${user.name} | Agendamento`,
    description: "Painel de controle - ALNBarber",
    keywords: [
      "barbearia",
      "gestão de barbearia",
      "agendamento online",
      "SaaS barbearia",
      "plataforma para barbeiros",
      "sistema para barbearia",
      "software barbearia",
      "barbeiros",
      "agenda barbearia",
      "clientes barbearia",
    ],
    authors: [{ name: "ALNBarber" }],
    creator: "ALNBarber",
    publisher: "ALNBarber",
    applicationName: "ALNBarber",
    robots: {
      index: true,
      follow: true,
      nocache: true,
    },
  };
}

export default async function SchedulePage({
    params,
} : {
    params: Promise<{ id: string}>
}) {
  const userId = ( await params).id;
  const user = await getInfoSchedule({ userId });

  if (!user) {
    redirect("/");
  }

  return <ScheduleContent clinic={user} />;
}
