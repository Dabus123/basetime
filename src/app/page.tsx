'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EventFeed } from '@/components/EventFeed';
import { CreateModal } from '@/components/CreateModal';
import { CalendarView } from '@/components/CalendarView';
import { useEvents, useEventActions, useUserRSVPs } from '@/hooks/useEvents';
import { useAccount } from 'wagmi';
import { CreateEventData, Event } from '@/types';

export default function HomePage() {
  const { address } = useAccount();
  const { events, isLoading, refreshEvents } = useEvents();
  const { userRSVPs } = useUserRSVPs(address);
  const { createEvent, rsvpToEvent, isPending, isSuccess } = useEventActions();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [showDevMenu, setShowDevMenu] = useState(false);
  const [longPressCountdown, setLongPressCountdown] = useState<number | null>(null);
  const longPressTimer = React.useRef<NodeJS.Timeout | null>(null);
  const countdownTimer = React.useRef<NodeJS.Timeout | null>(null);

  const handleCreateEvent = async (eventData: CreateEventData) => {
    setIsCreating(true);
    try {
      await createEvent(eventData);
      // Wait for transaction to be confirmed before refreshing
      // The refreshEvents will be called automatically when isSuccess changes
    } catch (error) {
      console.error('Failed to create event:', error);
    } finally {
      setIsCreating(false);
    }
  };

  // Refresh events when transaction is successful
  React.useEffect(() => {
    if (isSuccess) {
      refreshEvents();
      setIsCreateModalOpen(false);
      setSelectedDate(null);
      setShowNotification(true);
      // Hide notification after 3 seconds
      setTimeout(() => setShowNotification(false), 3000);
    }
  }, [isSuccess, refreshEvents]);

  const handleDateSelect = (startDate: Date, endDate?: Date) => {
    setSelectedDate(startDate);
    setSelectedEndDate(endDate || null);
    setIsCreateModalOpen(true);
  };

  const handleRSVP = async (eventId: number) => {
    try {
      await rsvpToEvent(eventId);
      refreshEvents();
    } catch (error) {
      console.error('Failed to RSVP:', error);
    }
  };

  const handleShare = (event: Event) => {
    if (navigator.share) {
      navigator.share({
        title: event.name,
        text: event.description,
        url: `${window.location.origin}/event/${event.id}`,
      });
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(`${window.location.origin}/event/${event.id}`);
    }
  };

  // Get next 2 upcoming events
  const getUpcomingEvents = () => {
    const now = Math.floor(Date.now() / 1000);
    return events
      .filter(event => event.startTime > now)
      .sort((a, b) => a.startTime - b.startTime)
      .slice(0, 2);
  };

  const upcomingEvents = getUpcomingEvents();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-screen bg-white flex flex-col overflow-hidden fixed inset-0"
    >
            {/* Mobile Header */}
            <motion.header
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="bg-blue-600 text-white px-4 py-3 flex-shrink-0"
            >
              <div className="flex items-center justify-between max-w-full">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsSideMenuOpen(true)}
                    className="p-1 flex-shrink-0"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </motion.button>
                  <span 
                    className="text-lg font-medium truncate select-none"
                    onTouchStart={(e) => {
                      let countdown = 7;
                      // Hide 7 and 6, show from 5 down
                      countdownTimer.current = setInterval(() => {
                        countdown--;
                        if (countdown > 0) {
                          // Only show countdown if 5 or less
                          if (countdown <= 5) {
                            setLongPressCountdown(countdown);
                          }
                        } else {
                          clearInterval(countdownTimer.current!);
                          setLongPressCountdown(null);
                          console.log('🎯 Dev menu activated!');
                          setShowDevMenu(true);
                        }
                      }, 1000);
                      
                      longPressTimer.current = setTimeout(() => {
                        clearInterval(countdownTimer.current!);
                        setLongPressCountdown(null);
                      }, 7000);
                    }}
                    onTouchEnd={() => {
                      if (longPressTimer.current) {
                        clearTimeout(longPressTimer.current);
                      }
                      if (countdownTimer.current) {
                        clearInterval(countdownTimer.current);
                      }
                      setLongPressCountdown(null);
                    }}
                  >
                    BaseTime
                  </span>
                </div>
              </div>
            </motion.header>

            {/* Long Press Countdown Overlay */}
            {longPressCountdown !== null && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="fixed top-20 right-4 bg-purple-600 text-white px-4 py-2 rounded-xl shadow-lg z-50"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <span className="font-bold">{longPressCountdown}</span>
                </div>
              </motion.div>
            )}

            {/* Main Content */}
            <motion.main
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              {/* Calendar or List View */}
              <div className="flex-1 overflow-hidden">
                {viewMode === 'calendar' ? (
                  <>
                    <CalendarView
                      events={events}
                      onRSVP={handleRSVP}
                      onShare={handleShare}
                      userRSVPs={userRSVPs}
                      onCreateEvent={handleDateSelect}
                    />
                    
                    {/* Upcoming Events Section */}
                    {upcomingEvents.length > 0 && (
                      <div className="bg-gray-50 border-t border-gray-200 p-4 flex-shrink-0">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Next Upcoming Events</h3>
                        <div className="space-y-2">
                          {upcomingEvents.map((event) => (
                            <div
                              key={event.id}
                              className="bg-white rounded-lg p-3 border border-gray-200 hover:shadow-sm transition-shadow cursor-pointer"
                              onClick={() => {
                                // You could add a click handler here to show event details
                                console.log('Event clicked:', event);
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-medium text-gray-900 truncate">
                                    {event.name}
                                  </h4>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {new Date(event.startTime * 1000).toLocaleDateString('en-US', {
                                      weekday: 'short',
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2 ml-2">
                                  <span className="text-xs text-gray-400">
                                    {event.rsvpCount} RSVPs
                                  </span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRSVP(event.id);
                                    }}
                                    className={`px-2 py-1 text-xs rounded-full transition-colors ${
                                      userRSVPs.has(event.id)
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                  >
                                    {userRSVPs.has(event.id) ? 'RSVPed' : 'RSVP'}
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="h-full overflow-hidden">
                    <EventFeed
                      events={events}
                      onRSVP={handleRSVP}
                      onShare={handleShare}
                      userRSVPs={userRSVPs}
                      isLoading={isLoading}
                      onCreateEvent={handleDateSelect}
                      viewMode="list"
                    />
                  </div>
                )}
              </div>

        {/* Bottom notification */}
        {showNotification && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="absolute bottom-0 left-0 right-0 bg-green-100 text-green-800 px-4 py-2 text-center text-sm z-30"
          >
            Event Created
          </motion.div>
        )}
      </motion.main>

      {/* Side Menu */}
      <AnimatePresence>
        {isSideMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSideMenuOpen(false)}
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
            />
            
            {/* Side Menu */}
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl z-50"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-bold text-gray-900">Menu</h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsSideMenuOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>
                
                <div className="space-y-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setViewMode('calendar');
                      setIsSideMenuOpen(false);
                    }}
                    className={`w-full text-left p-4 rounded-lg transition-colors ${
                      viewMode === 'calendar' 
                        ? 'bg-blue-100 text-blue-900 border-2 border-blue-300' 
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">Calendar View</span>
                    </div>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setViewMode('list');
                      setIsSideMenuOpen(false);
                    }}
                    className={`w-full text-left p-4 rounded-lg transition-colors ${
                      viewMode === 'list' 
                        ? 'bg-blue-100 text-blue-900 border-2 border-blue-300' 
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">List View</span>
                    </div>
                  </motion.button>
                  
                  {/* Dev Menu Button */}
                  {showDevMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 pt-4 border-t border-gray-200"
                    >
                      <div className="text-xs text-green-500 mb-2">🔓 Dev menu active</div>
                      <h3 className="text-xs font-semibold text-gray-500 mb-2">DEVELOPER</h3>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          const password = prompt('Enter password:');
                          if (password === 'yeti') {
                            window.location.href = '/dev';
                          } else if (password) {
                            alert('❌ Incorrect password');
                          }
                        }}
                        className="block w-full text-left p-3 bg-purple-50 text-purple-900 rounded-lg hover:bg-purple-100 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                          </svg>
                          <span className="font-medium text-sm">Base Social Test</span>
                        </div>
                      </motion.button>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Create Event Modal */}
      <CreateModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setSelectedDate(null);
          setSelectedEndDate(null);
        }}
        onSubmit={handleCreateEvent}
        isLoading={isCreating || isPending}
        selectedDate={selectedDate}
        selectedEndDate={selectedEndDate}
      />

    </motion.div>
  );
}