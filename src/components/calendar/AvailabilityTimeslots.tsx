
import React from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface AvailabilityTimeslotsProps {
  date: Date;
  duration: number;
  selectedTimeSlot: string | null;
  onSelectTimeSlot: (timeSlot: string) => void;
}

export function AvailabilityTimeslots({
  date,
  duration,
  selectedTimeSlot,
  onSelectTimeSlot
}: AvailabilityTimeslotsProps) {
  // Mock available timeslots based on the date
  // In a real app, this would come from an API based on the user's calendar
  const getAvailableTimeslots = (date: Date, durationMinutes: number) => {
    // Some pseudo-random availability based on the date to simulate
    // different available times on different days
    const day = date.getDate();
    const availableTimeslots = [];

    // Depending on the day of the month, generate different available slots
    const startHour = 9 + (day % 3); // Vary start time between 9, 10, and 11
    const endHour = 16 - (day % 2); // Vary end time between 15 and 16
    
    // For simplicity, generate slots every 30 minutes
    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minute of [0, 30]) {
        // Skip some slots to create a more realistic schedule
        if ((hour === 12 && minute === 0) || (day % 7 === 0 && hour === 14)) {
          continue; // simulate lunch break or other unavailable times
        }
        
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        availableTimeslots.push(timeString);
      }
    }
    
    return availableTimeslots;
  };

  const timeSlots = getAvailableTimeslots(date, duration);

  if (timeSlots.length === 0) {
    return (
      <div className="text-sm text-center py-4 text-muted-foreground">
        No available timeslots for this date
      </div>
    );
  }

  // Split time slots into morning and afternoon
  const morningSlots = timeSlots.filter(time => {
    const hour = parseInt(time.split(':')[0]);
    return hour < 12;
  });

  const afternoonSlots = timeSlots.filter(time => {
    const hour = parseInt(time.split(':')[0]);
    return hour >= 12;
  });

  const renderTimeSlotSection = (title: string, slots: string[]) => {
    if (slots.length === 0) return null;
    
    return (
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-muted-foreground">{title}</h4>
        <div className="grid grid-cols-2 gap-2">
          {slots.map((timeSlot) => (
            <button
              key={timeSlot}
              className={cn(
                "text-sm px-2 py-1.5 rounded-md transition-colors",
                selectedTimeSlot === timeSlot
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary hover:bg-secondary/80"
              )}
              onClick={() => onSelectTimeSlot(timeSlot)}
            >
              {timeSlot}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
      {renderTimeSlotSection("Morning", morningSlots)}
      {renderTimeSlotSection("Afternoon", afternoonSlots)}
    </div>
  );
}
