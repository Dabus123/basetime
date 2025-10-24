'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Event } from '@/types';
import { EventModal } from './EventModal';
import { DayActionModal } from './DayActionModal';
import { TBAPostModal, TBAPostData } from './TBAPostModal';
import { useScheduledPosts } from '@/hooks/useScheduledPosts';
import { useBaseSocial } from '@/hooks/useBaseSocial';

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
  const [isTBAModalOpen, setIsTBAModalOpen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationDirection, setAnimationDirection] = useState<'left' | 'right' | null>(null);
  const [showTimelineView, setShowTimelineView] = useState(false);
  
  // Scheduling hooks
  const { addScheduledPost, getDuePosts, updatePostStatus, getPendingPosts } = useScheduledPosts();
  const { postToBaseSocial } = useBaseSocial();

  // Check for due posts every minute
  useEffect(() => {
    let isProcessing = false;
    
    const checkDuePosts = async () => {
      if (isProcessing) {
        console.log('⏳ Already processing posts, skipping...');
        return;
      }
      
      const duePosts = getDuePosts();
      if (duePosts.length > 0) {
        isProcessing = true;
        console.log('📅 Found due posts:', duePosts.length);
        
        for (const post of duePosts) {
          console.log('📝 Processing due post:', post.header);
          
          try {
            // Post without image for now
            const postData = {
              header: post.header,
              description: post.description,
              imageUrl: '', // No image for now
              imageHeader: post.imageHeader,
              imageDescription: post.imageDescription,
            };
            
            await postToBaseSocial(postData);
            
            // Update post status to posted
            updatePostStatus(post.id, 'posted');
            
            console.log('✅ Successfully posted:', post.header);
          } catch (error) {
            console.error('❌ Failed to post:', post.header, error);
            // Keep the post as pending so it can be retried
          }
        }
        
        isProcessing = false;
      }
    };

    // Check immediately
    checkDuePosts();

    // Check every minute
    const interval = setInterval(checkDuePosts, 60000);

    return () => clearInterval(interval);
  }, []); // Empty dependency array to prevent constant re-running

  // Get scheduled posts for a specific date
  const getScheduledPostsForDate = (date: Date) => {
    const pendingPosts = getPendingPosts();
    return pendingPosts.filter(post => {
      const postDate = new Date(post.scheduledFor);
      return postDate.toDateString() === date.toDateString();
    });
  };

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.startTime * 1000);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  // Get events for current time slot on selected day
  const getEventsForTimeSlot = (hour: number) => {
    const targetDate = selectedDate || new Date();
    targetDate.setHours(hour, 0, 0, 0);
    const endHour = new Date(targetDate);
    endHour.setHours(hour + 1, 0, 0, 0);
    
    return events.filter(event => {
      const eventStart = new Date(event.startTime * 1000);
      const eventEnd = new Date(event.endTime * 1000);
      
      return eventStart < endHour && eventEnd > targetDate;
    });
  };

  // Swipe handling for month navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd || isAnimating) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      // Swipe left - next month
      setIsAnimating(true);
      setAnimationDirection('left');
      setTimeout(() => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
        setIsAnimating(false);
        setAnimationDirection(null);
      }, 150);
    }
    if (isRightSwipe) {
      // Swipe right - previous month
      setIsAnimating(true);
      setAnimationDirection('right');
      setTimeout(() => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
        setIsAnimating(false);
        setAnimationDirection(null);
      }, 150);
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['M', 'D', 'M', 'D', 'F', 'S', 'S'];

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
        events: getEventsForDate(date),
      });
    }
    
    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const today = new Date();
      const isToday = date.toDateString() === today.toDateString();
      
      days.push({
        date,
        isCurrentMonth: true,
        isToday,
        events: getEventsForDate(date),
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
        events: getEventsForDate(date),
      });
    }
    
    return days;
  }, [currentDate, events]);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setShowTimelineView(true);
  };

  const handleTBASubmit = (postData: TBAPostData) => {
    // For now, we'll schedule for the selected date at 14:00 (2 PM)
    const scheduledDateTime = new Date(selectedDate || new Date());
    scheduledDateTime.setHours(14, 0, 0, 0);
    
    addScheduledPost(postData, scheduledDateTime);
    setIsTBAModalOpen(false);
  };

  return (
    <div className="flex flex-col h-full relative overflow-hidden">
      {/* Calendar View */}
      <motion.div
        className="flex flex-col h-full"
        animate={{
          x: showTimelineView ? '-100%' : '0%'
        }}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 200
        }}
      >
        {/* Calendar Grid */}
      <div 
        className="bg-white border-b border-gray-200 relative overflow-hidden flex-shrink-0"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <motion.div 
          className="px-4 py-3"
          animate={{
            x: animationDirection === 'left' ? -20 : animationDirection === 'right' ? 20 : 0,
            opacity: isAnimating ? 0.7 : 1
          }}
          transition={{
            duration: 0.15,
            ease: "easeInOut"
          }}
        >
          {/* Month header */}
          <div className="flex items-center justify-between mb-4">
            <motion.h2 
              key={`${currentDate.getMonth()}-${currentDate.getFullYear()}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="text-lg font-semibold text-gray-900"
            >
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </motion.h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ChevronRightIcon className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
          
          {/* Days of week */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((day, index) => (
              <div key={index} className="text-center text-xs font-medium text-gray-500 py-1">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar dates */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              const isSelected = selectedDate && day.date.toDateString() === selectedDate.toDateString();
              
              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDateClick(day.date)}
                  className={`aspect-square flex flex-col items-center justify-center text-sm font-medium cursor-pointer rounded-lg ${
                    day.isCurrentMonth 
                      ? day.isToday 
                        ? 'bg-blue-600 text-white' 
                        : isSelected
                        ? 'bg-blue-100 text-blue-900 border-2 border-blue-300'
                        : 'text-gray-900 hover:bg-gray-100'
                      : 'text-gray-300'
                  }`}
                >
                  <span>{day.date.getDate()}</span>
                  {day.events.length > 0 && (
                    <div className="w-1 h-1 bg-blue-500 rounded-full mt-1"></div>
                  )}
                  {getScheduledPostsForDate(day.date).length > 0 && (
                    <div className="w-1 h-1 bg-blue-500 rounded-full mt-1"></div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
      </motion.div>

      {/* Timeline View */}
      <motion.div
        className="absolute inset-0 flex flex-col h-full bg-white"
        initial={{ x: '100%' }}
        animate={{
          x: showTimelineView ? '0%' : '100%'
        }}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 200
        }}
      >
        {/* Timeline Header */}
        <div className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between flex-shrink-0">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowTimelineView(false)}
            className="p-1"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </motion.button>
          <div className="text-center">
            <h2 className="text-lg font-medium">
              {selectedDate ? selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              }) : 'Select a day'}
            </h2>
          </div>
          <div className="w-6"></div> {/* Spacer for centering */}
        </div>

        {/* Timeline Content - Unified scrolling */}
        <div className="flex-1 overflow-y-auto">
          <div style={{ height: '2880px' }}> {/* 24 hours * 120px */}
            {Array.from({ length: 24 }, (_, hour) => (
              <div key={hour} className="flex h-30 border-b border-gray-200" style={{ height: '120px' }}>
                {/* Time column */}
                <div className="w-16 bg-gray-50 border-r border-gray-200 flex-shrink-0 flex items-center justify-center">
                  <span className="text-xs text-gray-500 font-medium">
                    {String(hour).padStart(2, '0')}:00
                  </span>
                </div>
                
                {/* Events area */}
                <div className="flex-1 relative px-4 py-2">
                  {/* Regular events */}
                  {getEventsForTimeSlot(hour).map((event, index) => (
                    <motion.div
                      key={event.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedEvent(event)}
                      className="h-16 bg-blue-200 rounded-lg flex items-center px-3 mb-1 cursor-pointer"
                    >
                      <span className="text-sm font-medium text-gray-800 truncate">
                        {event.name}
                      </span>
                    </motion.div>
                  ))}
                  
                  {/* Scheduled posts */}
                  {getPendingPosts().filter(post => {
                    const postDate = new Date(post.scheduledFor);
                    const targetDate = selectedDate || new Date();
                    return postDate.toDateString() === targetDate.toDateString() && 
                           postDate.getHours() === hour;
                  }).map((post, index) => (
                    <motion.div
                      key={post.id}
                      whileHover={{ scale: 1.02 }}
                      className="h-16 bg-blue-200 rounded-lg flex items-center px-3 mb-1"
                    >
                      <span className="text-sm font-medium text-gray-800 truncate">
                        📅 {post.header}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Floating Action Buttons */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-3">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onCreateEvent && onCreateEvent(selectedDate || new Date())}
          className="w-12 h-12 bg-white rounded-lg shadow-lg flex items-center justify-center"
        >
          <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsTBAModalOpen(true)}
          className="w-12 h-12 bg-white rounded-lg shadow-lg flex items-center justify-center"
        >
          <img 
            src="/splash.png" 
            alt="BaseTime" 
            className="w-6 h-6 rounded"
          />
        </motion.button>
      </div>

      {/* Modals */}
      <EventModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onRSVP={onRSVP}
        onShare={onShare}
        hasRSVPed={selectedEvent ? userRSVPs.has(selectedEvent.id) : false}
      />

      <DayActionModal
        isOpen={isDayActionModalOpen}
        onClose={() => setIsDayActionModalOpen(false)}
        selectedDate={selectedDate || new Date()}
        onCreateEvent={() => onCreateEvent && onCreateEvent(selectedDate || new Date())}
        onScheduleTBA={() => setIsTBAModalOpen(true)}
      />

      <TBAPostModal
        isOpen={isTBAModalOpen}
        onClose={() => setIsTBAModalOpen(false)}
        onSubmit={handleTBASubmit}
        selectedDate={selectedDate || new Date()}
      />
    </div>
  );
}