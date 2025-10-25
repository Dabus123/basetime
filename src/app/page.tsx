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
  const [showNotification, setShowNotification] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

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

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
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
                  <span className="text-lg font-medium truncate">BaseTime</span>
                </div>
              </div>
            </motion.header>

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
                  <CalendarView
                    events={events}
                    onRSVP={handleRSVP}
                    onShare={handleShare}
                    userRSVPs={userRSVPs}
                    onCreateEvent={handleDateSelect}
                  />
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
        }}
        onSubmit={handleCreateEvent}
        isLoading={isCreating || isPending}
        selectedDate={selectedDate}
      />
    </motion.div>
  );
}