import getSession from '@/lib/getSession'
import { redirect } from "next/navigation"
import { GridPlans } from "./_components/grid-plans"
import { getSubscription } from '@/utils/get-subscription'
import { SubscriptionDetail } from './_components/subscription-detail'
import { Metadata } from 'next'


export const metadata: Metadata = {
  title: "ALNBarber - Planos",
  description: "Planos - ALNBarber",
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
    "clientes barbearia"
  ],
  authors: [
    { name: "ALNBarber" },
  ],
  creator: "ALNBarber",
  publisher: "ALNBarber",
  applicationName: "ALNBarber",
  robots:{
    index: true,
    follow: true,
    nocache: true
  },
};




export default async function Plans() {
    const session = await getSession()

    if(!session) {
        redirect('/')
    }


    const subscription = await getSubscription({userId: session?.user?.id!})



    return(
            <div>
                {subscription?.status !== "active" && (
                    <GridPlans/>
                )}

                {subscription?.status === "active" && (
                    <SubscriptionDetail subscription={subscription!}/>
                )}
            </div>
    )
}