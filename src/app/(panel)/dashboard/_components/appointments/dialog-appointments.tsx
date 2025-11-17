import {
    DialogContent,
    DialogHeader,
    DialogDescription,
    DialogTitle
} from '@/components/ui/dialog'
import {AppointmentWithService} from './appointments-list'
import { format } from 'date-fns'
import {formatCurrency} from '@/utils/formatCurrency'
import { FaWhatsapp } from 'react-icons/fa'

interface DialogAppointmentProps{
    appointment: AppointmentWithService | null
}

export function DialogAppointments({appointment}: DialogAppointmentProps){
    return(
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    Detalhes do agendamento
                </DialogTitle>
                <DialogDescription>
                    Veja todos detalhes do agendamento
                </DialogDescription>
            </DialogHeader>

            <div className='py-4'>
                {appointment && (
                    <article>
                        <p><span className='font-semibold'>Horario agendado:</span> {appointment.time}</p>
                        <p className='mb-2'><span className='font-semibold'>
                            Data do agendamento:</span> {new Intl.DateTimeFormat ('pt-BR',{
                            timeZone: "UTC",
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit"
                         }).format(new Date(appointment.appointmentDate))}
                        </p>
                        <p><span className='font-semibold'>Nome:</span> {appointment.name}</p>
                        <p><span className='font-semibold'>Telefone:</span> {appointment.phone}</p>
                        <div className='flex items-center'>
                            <FaWhatsapp className='text-green-600 w-5 h-5'/>
                            <p className='text-green-600 hover:text-green-200 px-1'>
                                <a target='_blank' href={`https://wa.me/55${appointment.phone.replace(/\D/g, '')}?text=Olá,%20seu%20agendamento%20esta%20confirmado%20para%20o%20dia%20${new Intl.DateTimeFormat ('pt-BR',{
                            timeZone: "UTC",
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit"
                         }).format(new Date(appointment.appointmentDate))}%20ás%20${appointment.time}%20horas%20para%20o%20serviço%20${appointment.service.name}%20.%20Barbeiro:${appointment.barberName}`}>
                                    Clique aqui para falar no Whatsapp
                                </a>
                            </p>
                        </div>
                        <p><span className='font-semibold'>Email:</span> {appointment.email}</p>

                        <section className='mt-4 p-2 rounded-md'>
                            <p><span className='font-semibold'>Serviço:</span> {appointment.service.name}</p>
                            <p><span className='font-semibold'>Valor:</span> {formatCurrency((appointment.service.price / 100))}</p>
                            <p><span className='font-semibold'>Barbeiro:</span> {appointment.barberName}</p>
                        </section>
                    </article>
                )}
            </div>
        </DialogContent>
    )

}