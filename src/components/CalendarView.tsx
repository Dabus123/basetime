'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
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
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();
    
    const days: CalendarDay[] = [];
    
    // Previous month's trailing days
    const prevMonth = new Date(year, month - 1, 0);
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonth.getDate() - i);
      days.push({
        date,
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
    
    // Next month's leading days
    const remainingDays = 42 - days.length; // 6 weeks * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: false,
        events: [],
      });
    }
    
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
      return newDate;
    });
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleDayClick = (day: CalendarDay) => {
    if (day.events.length > 0) {
      // If day has events, show the first event
      setSelectedEvent(day.events[0]);
    } else {
      // If day has no events, show day action modal
      setSelectedDate(day.date);
      setIsDayActionModalOpen(true);
    }
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigateMonth('prev')}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigateMonth('next')}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronRightIcon className="w-5 h-5 text-gray-600" />
          </motion.button>
        </div>
      </div>

      {/* Day Names Header */}
      <div className="grid grid-cols-7 border-b border-gray-200">
        {dayNames.map(day => (
          <div key={day} className="p-3 text-center text-sm font-medium text-gray-500 bg-gray-50">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {calendarDays.map((day, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleDayClick(day)}
            className={`
              min-h-[120px] p-2 border-r border-b border-gray-200 cursor-pointer
              ${day.isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
              ${day.isToday ? 'bg-blue-50' : ''}
              hover:bg-blue-50 transition-colors
            `}
          >
            <div className="flex flex-col h-full">
              {/* Date Number */}
              <div className={`
                text-sm font-medium mb-1 flex items-center justify-between
                ${day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                ${day.isToday ? 'text-blue-600 font-bold' : ''}
              `}>
                <span>{day.date.getDate()}</span>
                {day.events.length === 0 && day.isCurrentMonth && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-1 h-1 bg-blue-400 rounded-full"
                  />
                )}
              </div>

              {/* Events */}
              <div className="flex-1 space-y-1">
                {day.events.slice(0, 3).map((event) => (
                  <motion.div
                    key={event.id}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => handleEventClick(event)}
                    className="flex items-center gap-1 p-1 rounded bg-blue-100 hover:bg-blue-200 transition-colors cursor-pointer"
                  >
                    <img
                      src={event.image}
                      alt={event.name}
                      className="w-4 h-4 rounded object-cover flex-shrink-0"
                    />
                    <span className="text-xs text-blue-800 font-medium truncate">
                      {event.name}
                    </span>
                  </motion.div>
                ))}
                {day.events.length > 3 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{day.events.length - 3} more
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
