'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { ConnectButton } from '@/components/ConnectButton';
import { CreateEventButton } from '@/components/CreateEventButton';
import { EventFeed } from '@/components/EventFeed';
import { CreateModal } from '@/components/CreateModal';
import { useEvents, useEventActions, useUserRSVPs } from '@/hooks/useEvents';
import { useAccount } from 'wagmi';
import { CreateEventData, Event } from '@/types';

export default function HomePage() {
  const { address } = useAccount();
  const { events, isLoading, refreshEvents } = useEvents();
  const { userRSVPs } = useUserRSVPs(address);
  const { createEvent, rsvpToEvent } = useEventActions();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleCreateEvent = async (eventData: CreateEventData) => {
    setIsCreating(true);
    try {
      await createEvent(eventData);
      setIsCreateModalOpen(false);
      setSelectedDate(null);
      refreshEvents();
    } catch (error) {
      console.error('Failed to create event:', error);
    } finally {
      setIsCreating(false);
    }
  };

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
      className="min-h-screen bg-gray-50"
    >
      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="bg-white shadow-sm border-b border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center">
              <CalendarIcon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 mr-2 sm:mr-3" />
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">BaseTime</h1>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4">
              <CreateEventButton onCreateEvent={() => setIsCreateModalOpen(true)} />
              <ConnectButton />
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <motion.main
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Your Onchain Event Hub
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4">
            Discover, create, and share events in the Base ecosystem. 
            RSVP to events and mint Event Pass NFTs as proof of attendance.
          </p>
          {events.length > 0 && events[0]?.name === "Base Hackathon 2024" && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-sm text-blue-700">
                📱 <strong>Demo Mode:</strong> Showing sample events. Connect your wallet and deploy contracts to create real events!
              </p>
            </div>
          )}
        </motion.div>

        {/* Events Feed */}
        <EventFeed
          events={events}
          onRSVP={handleRSVP}
          onShare={handleShare}
          userRSVPs={userRSVPs}
          isLoading={isLoading}
          onCreateEvent={handleDateSelect}
        />
      </motion.main>

      {/* Create Event Modal */}
      <CreateModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setSelectedDate(null);
        }}
        onSubmit={handleCreateEvent}
        isLoading={isCreating}
        selectedDate={selectedDate}
      />
    </motion.div>
  );
}