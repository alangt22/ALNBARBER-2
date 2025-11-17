"use client"
import { useState } from "react"
import DatePicker, { registerLocale } from 'react-datepicker'
import { ptBR } from 'date-fns/locale/pt-BR'
import 'react-datepicker/dist/react-datepicker.css'

registerLocale("pt-BR", ptBR)

interface DateTimePickerProps {
    minDate?: Date;
    className?: string;
    initialDate?: Date;
    onChange: (date: Date) => void;
}

export function DateTimePicker({ className, minDate, initialDate, onChange }: DateTimePickerProps) {
    // Função para zerar a hora
    function resetToMidnight(date: Date) {
        const newDate = new Date(date);
        newDate.setHours(0, 0, 0, 0); 
        return newDate;
    }

    const [startDate, setStartDate] = useState(initialDate ? resetToMidnight(initialDate) : resetToMidnight(new Date()));

    function handleChange(date: Date | null) {
        if (date) {
            const resetDate = resetToMidnight(date); 
            setStartDate(resetDate);
            onChange(resetDate);
        }
    }

    return (
        <DatePicker
            className={className}
            selected={startDate}
            minDate={minDate ? resetToMidnight(minDate) : resetToMidnight(new Date())} // Zera o minDate também
            onChange={handleChange}
            dateFormat="dd/MM/yyyy"
        />
    );
}
