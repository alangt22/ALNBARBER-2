"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { LogIn, Menu } from "lucide-react";
import { useSession } from "next-auth/react";
import { handleRegister } from "../_actions/login";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";

export function Header() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const navItens = [{ href: "/", label: "Profissionais" }];

  async function handleLogin(provider: "google") {
    await handleRegister(provider);
    setIsLoginModalOpen(false);
  }

  function handleChange() {
    setIsLoginModalOpen(true);
    setIsOpen(false);
  }

  const NavLinks = () => (
    <>
      {navItens.map((item) => (
        <Button
          onClick={() => setIsOpen(false)}
          key={item.href}
          asChild
          className="text-white"
        >
          <Link href={item.href} className="text-base">
            {item.label}
          </Link>
        </Button>
      ))}

      {status === "loading" ? (
        <></>
      ) : session ? (
        <div className="flex flex-col md:flex-row items-center gap-4">
          {session.user?.image && (
            <div className="w-12 h-12 overflow-hidden rounded-full">
              <Image
                src={session.user.image}
                alt="Foto de Perfil"
                width={60}
                height={60}
                className="object-cover"
              />
            </div>
          )}
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 text-white py-1 rounded-md px-4"
          >
            Acessar Painel
          </Link>
        </div>
      ) : ( 
        <Button onClick={handleChange} className="text-white cursor-pointer">
          <LogIn color="#fff"/>
          Portal da Barbearia
        </Button>
      )}
    </>
  );

  return (
    <header className="fixed top-0 right-0 left-0 z-[999] py-4 px-6 bg-[#040014] border-b border-white/10">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-3xl font-bold text-blue-500">
          ALN<span className="text-white">Barber</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-4">
          <NavLinks />
        </nav>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button
              className="text-white hover:scale-110 cursor-pointer"
              variant="ghost"
              size="icon"
            >
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>

          <SheetContent
            side="right"
            className="w-[240px] sm:w-[300px] z-[9999] py-10 px-7 gap-0"
          >
            <SheetTitle className="text-2xl font-bold">Menu</SheetTitle>
            <SheetHeader></SheetHeader>

            <SheetDescription>Veja nossos links</SheetDescription>

            <nav className="flex flex-col space-y-4 mt-6">
              <NavLinks />
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      {isLoginModalOpen && ( 
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-zinc-900 p-8 gap-6 rounded-md text-center">
            <h1 className="text-2xl font-bold mb-2 text-blue-500">
              ALN<span className="text-white">Barber</span>
            </h1>
            <h3 className="text-lg font-semibold">
              Faça login ou Crie sua conta com Google
            </h3>
            <div className="mt-4">
              <Button
                onClick={() => handleLogin("google")}
                className="w-full mb-4 cursor-pointer text-white"
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
    </header>
  );
}
