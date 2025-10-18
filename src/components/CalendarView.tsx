'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Event } from '@/types';
import { EventModal } from './EventModal';
import { DayActionModal } from './DayActionModal';

interface CalendarViewProps {
  events: Event[];
  onRSVP: (eventId: number) => void;
  onShare: (event: Event) => void;
  userRSVPs: Set<number>;
  isLoading: boolean;
  onCreateEvent?: (date: Date) => void;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: Event[];
}

export function CalendarView({ events, onRSVP, onShare, userRSVPs, isLoading, onCreateEvent }: CalendarViewProps) {
  console.log('🎯 CalendarView component is rendering!');
  console.log('DEBUG: CalendarView is being called');
  console.error('ERROR TEST: This should definitely show up');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDayActionModalOpen, setIsDayActionModalOpen] = useState(false);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    console.log('🗓️ Calendar calculating for:', monthNames[month], year, 'Month index:', month);
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();
    
    const days: CalendarDay[] = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push({
        date: new Date(year, month, 0), // This will be ignored in rendering
        isCurrentMonth: false,
        isToday: false,
        events: [],
      });
    }
    
    // Current month's days
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayEvents = events.filter(event => {
        const eventDate = new Date(event.startTime * 1000);
        return eventDate.getDate() === day && 
               eventDate.getMonth() === month && 
               eventDate.getFullYear() === year;
      });
      
      days.push({
        date,
        isCurrentMonth: true,
        isToday: date.toDateString() === today.toDateString(),
        events: dayEvents,
      });
    }
    
    // Fill remaining cells to complete the grid (but don't show next month's dates)
    const totalCells = Math.ceil(days.length / 7) * 7; // Round up to complete weeks
    while (days.length < totalCells) {
      days.push({
        date: new Date(year, month + 1, 0), // This will be ignored in rendering
        isCurrentMonth: false,
        isToday: false,
        events: [],
      });
    }
    
    console.log('Total days calculated:', days.length, 'Current month days:', daysInMonth);
    console.log('First few days:', days.slice(0, 7).map(d => d.isCurrentMonth ? `${d.date.getDate()}/${d.date.getMonth() + 1}` : 'empty'));
    console.log('Last few days:', days.slice(-7).map(d => d.isCurrentMonth ? `${d.date.getDate()}/${d.date.getMonth() + 1}` : 'empty'));
    return days;
  }, [currentDate, events]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      console.log('🔄 Navigating to:', monthNames[newDate.getMonth()], newDate.getFullYear(), 'Month index:', newDate.getMonth());
      return newDate;
    });
  };

  const handleEventClick = (event: Event, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedEvent(event);
  };

  const handleDayClick = (day: CalendarDay) => {
    // Always show day action modal when clicking a day
    setSelectedDate(day.date);
    setIsDayActionModalOpen(true);
  };

  const handleCreateEvent = () => {
    setIsDayActionModalOpen(false);
    if (selectedDate && onCreateEvent) {
      onCreateEvent(selectedDate);
    }
  };

  const handleScheduleTBA = () => {
    setIsDayActionModalOpen(false);
    // TODO: Implement TBA post functionality
    console.log('Schedule TBA post for:', selectedDate);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-sm sm:text-lg">
              {monthNames[currentDate.getMonth()].charAt(0)}
            </span>
          </div>
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl text-gray-900 font-display">
              <span className="font-bold">{new Date().getDate()}</span> <span className="font-bold">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Plan your events with precision</p>
          </div>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigateMonth('prev')}
            className="p-2 sm:p-3 rounded-xl bg-white hover:bg-gray-50 transition-all duration-200 shadow-sm border border-gray-200"
          >
            <ChevronLeftIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigateMonth('next')}
            className="p-2 sm:p-3 rounded-xl bg-white hover:bg-gray-50 transition-all duration-200 shadow-sm border border-gray-200"
          >
            <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          </motion.button>
        </div>
      </div>

      {/* Day Names Header */}
      <div className="grid grid-cols-7 bg-gray-50/50">
        {dayNames.map(day => (
          <div key={day} className="p-2 sm:p-3 md:p-4 text-center text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 bg-white">
        {calendarDays.map((day, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: day.isCurrentMonth ? 1.02 : 1 }}
            whileTap={{ scale: day.isCurrentMonth ? 0.98 : 1 }}
            onClick={() => day.isCurrentMonth ? handleDayClick(day) : undefined}
            className={`
              min-h-[80px] sm:min-h-[100px] md:min-h-[120px] lg:min-h-[140px] p-2 sm:p-3 border-r border-b border-gray-100 relative
              ${day.isCurrentMonth ? 'bg-white hover:bg-blue-50/30 cursor-pointer' : 'bg-gray-50/30'}
              ${day.isToday ? 'bg-gradient-to-br from-blue-50 to-indigo-50 ring-2 ring-blue-200' : ''}
              transition-all duration-200 group
            `}
          >
            <div className="flex flex-col h-full">
              {/* Date Number */}
              <div className={`
                text-xs sm:text-sm font-semibold mb-1 sm:mb-2 flex items-center justify-between
                ${day.isCurrentMonth ? 'text-gray-900' : 'text-transparent'}
                ${day.isToday ? 'text-blue-600 font-bold' : ''}
              `}>
                <span className="text-sm sm:text-base md:text-lg">
                  {day.isCurrentMonth ? day.date.getDate() : ''}
                </span>
                {day.isCurrentMonth && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <PlusIcon className="w-4 h-4 text-gray-400 hover:text-blue-500" />
                  </motion.div>
                )}
              </div>

              {/* Events */}
              <div className="flex-1 space-y-1 sm:space-y-1.5">
                {day.isCurrentMonth && day.events.slice(0, 2).map((event) => (
                  <motion.div
                    key={event.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={(e) => handleEventClick(event, e)}
                    className="flex items-center gap-1 sm:gap-2 p-1 sm:p-2 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 cursor-pointer border border-blue-100 hover:border-blue-200"
                  >
                    <img
                      src={event.image}
                      alt={event.name}
                      className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 rounded-md object-cover flex-shrink-0 shadow-sm"
                    />
                    <span className="text-xs text-blue-800 font-medium truncate">
                      {event.name}
                    </span>
                  </motion.div>
                ))}
                {day.isCurrentMonth && day.events.length > 2 && (
                  <div className="text-xs text-gray-500 text-center py-1 px-1 sm:px-2 bg-gray-100 rounded-md">
                    +{day.events.length - 2} more
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Event Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <EventModal
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
            onRSVP={onRSVP}
            onShare={onShare}
            hasRSVPed={userRSVPs.has(selectedEvent.id)}
          />
        )}
      </AnimatePresence>

      {/* Day Action Modal */}
      <DayActionModal
        isOpen={isDayActionModalOpen}
        onClose={() => setIsDayActionModalOpen(false)}
        selectedDate={selectedDate!}
        onCreateEvent={handleCreateEvent}
        onScheduleTBA={handleScheduleTBA}
      />
    </div>
  );
}