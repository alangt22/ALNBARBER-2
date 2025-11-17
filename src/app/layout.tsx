import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionAuthProvider } from '@/components/session-auth'
import {Toaster} from 'sonner'
import {QueryClientContext} from '@/providers/queryclient'
import { AosInit } from "./(public)/_components/aos-init";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AgendaPRO - Encontre os melhores profissionais em um único local!",
  description: "Somos uma plataforma dedicada a diversos segmentos, com o objetivo de agilizar o atendimento de forma simples, organizada e eficiente.",
  robots:{
    index: true,
    follow: true,
    nocache: true
  },
  openGraph:{
    title: "AgendaPRO - Encontre os melhores profissionais em um único local!",
    description: "Somos uma plataforma dedicada a diversos segmentos, com o objetivo de agilizar o atendimento de forma simples, organizada e eficiente.",
    images: [`${process.env.NEXT_PUBLIC_URL}/logoAgendaPRO.png`],
    url: `${process.env.NEXT_PUBLIC_URL}`, 
    type: "website"
  },
  twitter: {
    card: "summary_large_image", 
    title: "AgendaPRO - Encontre os melhores profissionais em um único local!",
    description: "Somos uma plataforma dedicada a diversos segmentos, com o objetivo de agilizar o atendimento de forma simples, organizada e eficiente.",
    images: [`${process.env.NEXT_PUBLIC_URL}/logoAgendaPRO.png` ]
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en"
    className="overflow-x-hidden dark-blue">
      
      <body
        className={`overflow-x-hidden ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionAuthProvider>
          <QueryClientContext>
            <Toaster
              duration={2500}
            />
            {children}
            <AosInit/>
          </QueryClientContext>
        </SessionAuthProvider>
      </body>
    </html>
  );
}
