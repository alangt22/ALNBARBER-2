import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter
} from '@/components/ui/card'
import {subscriptionPlans} from '@/utils/plans/index'
import {SubscriptionButton} from './subscription-button'


export function GridPlans(){
    return (
        <section className='grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5'>
            {subscriptionPlans.map((plan, index) => (
                <Card 
                    key={plan.id} 
                    className={`flex flex-col w-full mx-auto py-0 ${index === 1 && "border-emerald-500"}`}
                >
                    {index === 1 && (
                        <div className='bg-emerald-500 w-full py-3 text-center rounded-t-xl'>
                            <p className='font-semibold text-white '>PROMOÇÃO EXCLUSIVA</p>
                        </div>
                    )}
                    <CardHeader>
                        <CardTitle className='text-xl md:text-2xl mt-5'>
                            {plan.name}
                        </CardTitle>
                        <CardDescription>
                            {plan.description}
                        </CardDescription>
                    </CardHeader>
                        <ul>
                            {plan.features.map((feature, index) => (
                                <li key={index} className='text-sm ml-7 md:text-base'>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <div className='mt-4 ml-7'>
                            <p className='text-gray-400 line-through'>{plan.oldPrice}</p>
                            <p className='text-white text-2xl font-bold'>{plan.price}<span className='text-sm text-zinc-400'> / ao mes</span></p>
                        </div>
                    <CardContent>
                        <CardFooter className='mb-2'>
                            <SubscriptionButton type={plan.id === "BASIC"? "BASIC" : "PROFESSIONAL"}/>
                        </CardFooter>
                    </CardContent>
                </Card>
            ))}
        </section>
    )
}