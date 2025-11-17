import { Button } from '@/components/ui/button'
import getSession from '@/lib/getSession'
import { Calendar } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import {ButtonCopyLink} from './_components/button-copy-link'
import { Reminders } from './_components/reminder/reminders'
import { Appointments } from './_components/appointments/appointments'
import { Suspense } from 'react'
import { checkSubscription } from '@/utils/permissions/checkSubscription'
import { LabelSubscription } from '@/components/ui/label-subscription'

import { Loader } from "lucide-react";

export default async function Dashboard() {
    const session = await getSession()

    if(!session) {
        redirect('/')
    }
    
    const subscription = await checkSubscription(session?.user?.id!)

    return (
        <main>
            <div className='space-x-2 flex items-center justify-end'>
                <Link
                    href={`/clinica/${session.user?.id}`}
                    target='_blank'
                >
                    <Button className='bg-blue-500 hover:bg-blue-900 cursor-pointer flex-1 md:flex-[0]'>
                        <Calendar className='w-5 h-5'/>
                        <span>Novo agendamento</span>
                    </Button>
                </Link>

                <ButtonCopyLink userId={session.user?.id!}/>
            </div>

            {/*Revisar esse loading */}
            <Suspense fallback={<Loader size={16} color="#ffffff" className="animate-spin flex text-center"/>}>

            {subscription?.subscriptionStatus === "EXPIRED" && (
                <LabelSubscription  expired={true}/>
            )}

            {subscription?.subscriptionStatus === "TRIAL" && (
                <div className='bg-green-400 text-white text-sm md:text-base px-3 py-2 rounded-md my-2'>
                    <p className='font-semibold'>
                        {subscription?.message}
                    </p>
                </div>
            )}

            {subscription?.subscriptionStatus !== "EXPIRED" && (
                <section className='grid grid-cols-1 gap-4 lg:grid-cols-2 mt-4'>
                    <Appointments userId={session.user?.id!}/>
                    <Reminders userId={session.user?.id!}/>
                </section>
            )}

            </Suspense>
        </main>
    )
}