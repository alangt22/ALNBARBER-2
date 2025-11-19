"use client";

import { Check, Loader, MapPin } from "lucide-react";
import { handleRegister } from "../_actions/login";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { Carrossel } from "./carrossel";
import Image from "next/image";

export function About() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(provider: "google") {
    await handleRegister(provider);
    setIsLoginModalOpen(false);
  }

  function handleChange() {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsLoginModalOpen(true);
      setIsOpen(false);
    }, 500);
  }
  return (
    <section className="py-16">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div
            className="relative"
            data-aos="fade-right"
            data-aos-offset="200"
            data-aos-easing="ease-in-sine"
          >
            <div className="relative w-full h-[650px] rounded-3xl shadow-2xl">
              {/* <Carrossel/> */}
              <Image
                src="/banner.png"
                fill
                className=" rounded-3xl"
                alt="Foto de Perfil"
              />
            </div>
          </div>

          <div
            className="space-y-6 mt-10"
            data-aos="fade-up-left"
            data-aos-delay="300"
          >
            <h2 className="text-4xl font-bold">SOBRE</h2>

            <p>
              AgendaPRO é uma plataforma digital projetada para otimizar a
              gestão de compromissos e atendimentos. Com uma interface intuitiva
              e ferramentas avançadas, permite agendar, organizar e gerenciar
              horários de maneira prática e eficiente. Ideal para diversos
              segmentos, a Agenda Pro facilita o controle de agendas, a
              comunicação com clientes e a maximização da produtividade,
              oferecendo uma experiência ágil e organizada para profissionais de
              diversas áreas.
            </p>

            <ul className="space-y-4">
              <li
                className="flex items-center gap-2"
                data-aos="fade-left"
                data-aos-easing="linear"
                data-aos-duration="2000"
              >
                <Check className="text-green-500" />
                Agendamento Inteligente.
              </li>
              <li
                className="flex items-center gap-2"
                data-aos="fade-left"
                data-aos-easing="linear"
                data-aos-duration="1500"
              >
                <Check className="text-green-500" />
                Gestão de agendamentos.
              </li>
              <li
                className="flex items-center gap-2"
                data-aos="fade-left"
                data-aos-easing="linear"
                data-aos-duration="500"
              >
                <Check className="text-green-500" />
                Customização de Horários de Funcionamento
              </li>
            </ul>

            <div className="flex gap-2">
              <Button
                onClick={handleChange}
                className="bg-blue-500 hover:bg-blue-900 w-44 px-6 font-semibold"
              >
                {isLoading ? (
                  <span className="w-44 flex items-center justify-center">
                    <Loader className="animate-spin" />
                  </span>
                ) : (
                  "Faça Login"
                )}
              </Button>
            </div>
          </div>
        </div>
        {isLoginModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
              <div className="bg-zinc-900 p-6 rounded-md text-center">
                <h1 className="text-2xl font-bold mb-2 text-blue-500">
                  ALN<span className="text-white">Barber</span>
                </h1>
              <h3 className="text-lg font-semibold">
                Faça login ou Crie sua conta com Google
              </h3>
              <div className="mt-4">
                <Button
                  onClick={() => handleLogin("google")}
                  className="w-full mb-4 cursor-pointer"
                >
                  Login com Google
                  <FcGoogle className="mr-2 w-5 h-5" />
                </Button>
              </div>
              <Button
                onClick={() => setIsLoginModalOpen(false)}
                variant="outline"
                className="w-full mt-4 cursor-pointer"
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
