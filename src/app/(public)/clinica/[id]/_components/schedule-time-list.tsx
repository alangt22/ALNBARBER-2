"use client"

import { Button } from "@/components/ui/button";
import { TimeSlot } from "./schedule-content";
import { cn } from "@/lib/utils";
import {isToday, isSlotInThePast, isSlotSequenceAvailable} from './schedule-utils'

interface ScheduleTimeListProps{
    selecedDate: Date;
    selectedTime: string;
    requiredSlots: number;
    blockedTimes: string[];
    availableTimeSlots: TimeSlot[];
    clinicTimes: string[];
    onSelectTime: (time: string) => void;
}

export function ScheduleTimeList({
    selecedDate,
    selectedTime,
    requiredSlots,
    blockedTimes,
    availableTimeSlots,
    clinicTimes,
    onSelectTime
}: ScheduleTimeListProps){

    const dateIsToday = isToday(selecedDate)

    return(
        <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
            {availableTimeSlots.map((slot) => {

                const  sequenceOK = isSlotSequenceAvailable(
                    slot.time,
                    requiredSlots,
                    clinicTimes,
                    blockedTimes
                )

                
                const slotInPaste =  dateIsToday && isSlotInThePast(slot.time)

                const slotEnabled = slot.time && sequenceOK && !slotInPaste


                return(
                    <Button
                        onClick={() => slotEnabled && onSelectTime(slot.time)}
                        type="button"
                        variant="outline"
                        key={slot.time}
                        className={cn("h-10 select-none",
                            selectedTime === slot.time && "border-3 border-emerald-500 text-primary",
                            !slotEnabled && "opacity-50 cursor-not-allowed border-3 border-red-500"
                        )}
                        disabled={!slotEnabled}
                    >
                        {slot.time}
                    </Button>
                )
            })}
        </div>
    )
}