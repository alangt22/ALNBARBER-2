"use client";
import { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { ptBR } from "date-fns/locale/pt-BR";
import "react-datepicker/dist/react-datepicker.css";

registerLocale("pt-BR", ptBR);

interface DateTimePickerProps {
  minDate?: Date;
  className?: string;
  initialDate?: Date;
  onChange: (date: Date) => void;
  allowedDays?: number[];
}

export function DateTimePicker({
  className,
  minDate,
  initialDate,
  onChange,
  allowedDays,
}: DateTimePickerProps) {
  // Função para zerar a hora
  function resetToMidnight(date: Date) {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  }

  const [startDate, setStartDate] = useState(
    initialDate ? resetToMidnight(initialDate) : resetToMidnight(new Date())
  );

  function handleChange(date: Date | null) {
    if (date) {
      const resetDate = resetToMidnight(date);
      setStartDate(resetDate);
      onChange(resetDate);
    }
  }

  return (
    <>
      <DatePicker
        className={className}
        selected={startDate}
        minDate={
          minDate ? resetToMidnight(minDate) : resetToMidnight(new Date())
        } // Zera o minDate também
        onChange={handleChange}
        dateFormat="dd/MM/yyyy"
        locale="pt-BR"
        filterDate={(date) => {
          if (!allowedDays) return true;
          const day = date.getDay();
          return allowedDays.includes(day);
        }}
      />
      <style>{`
  /* Fundo escuro no input */
  .react-datepicker-wrapper input {
    background-color: #1f1f1f !important;
    color: white !important;
    border: 1px solid #3a3a3a !important;
  }

  /* Fundo escuro no calendário */
  .react-datepicker {
    background-color: #1f1f1f !important;
    border: 1px solid #3a3a3a !important;
    color: white !important;
  }

  .react-datepicker__header {
    background-color: #1f1f1f !important;
    border-bottom: 1px solid #3a3a3a !important;
  }

  .react-datepicker__day,
  .react-datepicker__day-name,
  .react-datepicker__current-month {
    color: white !important;
  }

  /* Dias indisponíveis */
  .react-datepicker__day--disabled {
    color: #777 !important; /* cor mais clara/acinzentada */
    background-color: #2a2a2a !important; /* fundo levemente diferente */
    cursor: not-allowed;
  }

  /* Hover nos dias disponíveis */
  .react-datepicker__day:not(.react-datepicker__day--disabled):hover {
    background-color: #333 !important;
    border-radius: 50%;
  }
`}</style>
    </>
  );
}
