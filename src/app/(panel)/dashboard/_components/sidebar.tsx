"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import clsx from "clsx"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Banknote, CalendarCheck2, ChevronLeft, ChevronRight, Folder, List, Settings } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import odontoPRO from '../../../../../public/logo-odonto.png'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger
} from '@/components/ui/collapsible'


export function SidebarDashboard({children}: {children: React.ReactNode}) {

    const pathname = usePathname()
    const [ isCollapsed, setIsColapsed] = useState(false)
    const [ isOpen, setIsOpen] = useState(false)

    const [isLargeScreen, setIsLargeScreen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsLargeScreen(window.innerWidth >= 768)
        }

        handleResize()
        window.addEventListener("resize", handleResize)

        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [])

    useEffect(() => {
        if(isLargeScreen) {
            setIsOpen(false)
        }
    }, [isLargeScreen])
    

    return(
        <div className="flex min-h-screen w-full">

            <aside className={clsx("flex flex-col border-r bg-background transition-all duration-300 p-4 h-full",{
                "w-20": isCollapsed,
                "w-64": !isCollapsed,
                "hidden md:flex md:fixed": true
            })}>
                <div className="mb-6 mt-4">
                    {!isCollapsed && (
                        <h1 className="text-4xl font-bold text-blue-500">ALN<span className="text-white">Barber</span></h1>
                    )}
                </div>

                <Button 
                    className="bg-gray-100 hover:bg-gray-50 text-zinc-900 self-end mb-2"
                    onClick={() => setIsColapsed(!isCollapsed)}
                >
                    {isCollapsed ? (
                        <ChevronRight className="w-12 h-1/2"/>
                    ) : (
                        <ChevronLeft className="w-12 h-1/2"/>
                    )}
                    
                </Button>

                {/*quando a sidebar estiver recolhida mostra icon apenas */}
                {isCollapsed && (
                    <nav className="flex flex-col gap-1 overflow-hidden mt-2">                    
                        <SidebarLink
                            href="/dashboard"
                            label="Agendamentos"
                            pathname={pathname}
                            isColapsed={isCollapsed}
                            icon={<CalendarCheck2 className="w-6 h-6"/>}
                        />

                        <SidebarLink
                            href="/dashboard/services"
                            label="Serviços"
                            pathname={pathname}
                            isColapsed={isCollapsed}
                            icon={<Folder className="w-6 h-6"/>}
                        />
                        <SidebarLink
                            href="/dashboard/profile"
                            label="Meu perfil"
                            pathname={pathname}
                            isColapsed={isCollapsed}
                            icon={<Settings className="w-6 h-6"/>}
                        />

                        <SidebarLink
                            href="/dashboard/plans"
                            label="Planos"
                            pathname={pathname}
                            isColapsed={isCollapsed}
                            icon={<Banknote className="w-6 h-6"/>}
                        />
                    </nav>
                )}

                <Collapsible open={!isCollapsed}>
                    <CollapsibleContent>
                        <nav className="flex flex-col gap-1 overflow-hidden">
                            <span className="text-sm text-gray-400 font-medium mt-1 uppercase">
                                Painel
                            </span>
                        
                            <SidebarLink
                                href="/dashboard"
                                label="Agendamentos"
                                pathname={pathname}
                                isColapsed={isCollapsed}
                                icon={<CalendarCheck2 className="w-6 h-6"/>}
                            />

                            <SidebarLink
                                href="/dashboard/services"
                                label="Serviços"
                                pathname={pathname}
                                isColapsed={isCollapsed}
                                icon={<Folder className="w-6 h-6"/>}
                            />
                            <span className="text-sm text-gray-400 font-medium mt-1 uppercase">
                                Configurações
                            </span>


                            <SidebarLink
                                href="/dashboard/profile"
                                label="Meu perfil"
                                pathname={pathname}
                                isColapsed={isCollapsed}
                                icon={<Settings className="w-6 h-6"/>}
                            />

                            <SidebarLink
                                href="/dashboard/plans"
                                label="Planos"
                                pathname={pathname}
                                isColapsed={isCollapsed}
                                icon={<Banknote className="w-6 h-6"/>}
                            />
                        </nav>
                    </CollapsibleContent>
                </Collapsible>

            </aside>

            <div className={clsx("flex flex-1 flex-col transition-all duration-300", {
                "md:ml-20": isCollapsed,
                "md:ml-64": !isCollapsed
            })}>
                <header className="md:hidden flex items-center justify-between border-b px-2 md:px-6 h-14 z-10 sticky top-0">
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <div className="flex items-center gap-4">
                            <SheetTrigger asChild>
                                <Button 
                                    variant="outline" 
                                    size="icon" 
                                    className="md:hidden"
                                    onClick={() => setIsColapsed(false)}
                                >
                                    <List className="w-5 h-5"/>
                                </Button>
                            </SheetTrigger>

                            <h1 className="text-base md:text-lg font-semibold text-blue-500">
                                <span className="text-white">Menu</span> ALN<span className="text-white">Barber</span>
                            </h1>
                        </div>

                        <SheetContent side="right" className="sm:max-w-xs text-black px-7 py-5 gap-0">
                        <SheetTitle className="text-2xl text-blue-500">ALN<span className="text-[#ffffff]">Barber</span></SheetTitle>
                        <SheetDescription>
                            Menu administrativo
                        </SheetDescription>

                        <nav className="grid gap-2 text-base pt-5">
                            <button onClick={() => setIsOpen(false)}>
                                <SidebarLink
                                    href="/dashboard"
                                    label="Agendamentos"
                                    pathname={pathname}
                                    isColapsed={isCollapsed}
                                    icon={<CalendarCheck2 className="w-6 h-6"/>}
                                />
                            </button>

                            <button onClick={() => setIsOpen(false)}>
                            <SidebarLink
                                href="/dashboard/services"
                                label="Serviços"
                                pathname={pathname}
                                isColapsed={isCollapsed}
                                icon={<Folder className="w-6 h-6"/>}
                            />
                            </button>

                            <button onClick={() => setIsOpen(false)}>
                            <SidebarLink
                                href="/dashboard/profile"
                                label="Meu perfil"
                                pathname={pathname}
                                isColapsed={isCollapsed}
                                icon={<Settings className="w-6 h-6"/>}
                            />
                            </button>
                            
                            <button onClick={() => setIsOpen(false)}>
                            <SidebarLink
                                href="/dashboard/plans"
                                label="Planos"
                                pathname={pathname}
                                isColapsed={isCollapsed}
                                icon={<Banknote className="w-6 h-6"/>}
                            />
                            </button>
                        </nav>
                    </SheetContent>
                    </Sheet>
                </header>

                <main className="flex-1 py-4 px-2 md:p-6">
                    {children}
                </main>

            </div>
        </div>
    )
}


interface SidebarLinkProps {
    href: string;
    icon: React.ReactNode;
    label: string;
    pathname: string;
    isColapsed: boolean;
}

function SidebarLink({href, icon, label, pathname, isColapsed}: SidebarLinkProps) {
    return(
        <Link
            href={href}
        >
            <div className={clsx("flex items-center gap-2 px-3 py-2 rounded-md  transition-colors", {
                "text-white bg-blue-500": pathname === href,
                "text-gray-400 hover:bg-gray-100": pathname !== href,
            })}>
                <span className="w-6 h-6">{icon}</span>
                {!isColapsed && <span>{label}</span>}
            </div>
        </Link>
    )
}