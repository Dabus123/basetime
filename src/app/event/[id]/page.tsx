'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, CalendarIcon, UserGroupIcon, ClockIcon } from '@heroicons/react/24/outline';
import { ConnectButton } from '@/components/ConnectButton';
import { useAccount } from 'wagmi';
import { useEvents, useEventActions } from '@/hooks/useEvents';
import { formatDateTime, isEventLive, isEventUpcoming, getTimeUntilEvent } from '@/utils/helpers';
import { useParams, useRouter } from 'next/navigation';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isConnected } = useAccount();
  const { events } = useEvents();
  const { rsvpToEvent, isPending } = useEventActions();
  
  const eventId = parseInt(params.id as string);
  const event = events.find(e => e.id === eventId);

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h2>
          <p className="text-gray-600 mb-6">The event you&apos;re looking for doesn&apos;t exist.</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const eventStatus = isEventLive(event) ? 'live' : isEventUpcoming(event) ? 'upcoming' : 'ended';
  
  const getStatusColor = () => {
    switch (eventStatus) {
      case 'live':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ended':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = () => {
    switch (eventStatus) {
      case 'live':
        return 'Live Now';
      case 'upcoming':
        return getTimeUntilEvent(event);
      case 'ended':
        return 'Ended';
      default:
        return '';
    }
  };

  const handleRSVP = async () => {
    if (!isConnected) return;
    try {
      await rsvpToEvent(event.id);
    } catch (error) {
      console.error('Failed to RSVP:', error);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.name,
        text: event.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors mr-4"
              >
                <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
              </button>
              <CalendarIcon className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">BaseTime</h1>
            </div>
            <ConnectButton />
          </div>
        </div>
      </header>

      {/* Event Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          {/* Event Image */}
          <div className="relative h-64 bg-gradient-to-br from-blue-50 to-purple-50">
            {event.image ? (
              <img
                src={event.image}
                alt={event.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <CalendarIcon className="w-24 h-24 text-gray-300" />
              </div>
            )}
            
            {/* Status Badge */}
            <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor()}`}>
              {getStatusText()}
            </div>
          </div>

          {/* Event Details */}
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.name}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-center text-gray-600">
                <ClockIcon className="w-5 h-5 mr-3" />
                <div>
                  <p className="font-medium">Start Time</p>
                  <p>{formatDateTime(event.startTime)}</p>
                </div>
              </div>
              
              <div className="flex items-center text-gray-600">
                <ClockIcon className="w-5 h-5 mr-3" />
                <div>
                  <p className="font-medium">End Time</p>
                  <p>{formatDateTime(event.endTime)}</p>
                </div>
              </div>
              
              <div className="flex items-center text-gray-600">
                <UserGroupIcon className="w-5 h-5 mr-3" />
                <div>
                  <p className="font-medium">RSVPs</p>
                  <p>{event.rsvpCount} attendees</p>
                </div>
              </div>
              
              <div className="flex items-center text-gray-600">
                <CalendarIcon className="w-5 h-5 mr-3" />
                <div>
                  <p className="font-medium">Created by</p>
                  <p className="font-mono text-sm">{event.creator.slice(0, 6)}...{event.creator.slice(-4)}</p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed">{event.description}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {isConnected ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleRSVP}
                  disabled={isPending || eventStatus === 'ended'}
                  className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
                    eventStatus === 'ended'
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isPending ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      RSVPing...
                    </div>
                  ) : (
                    'RSVP to Event'
                  )}
                </motion.button>
              ) : (
                <div className="flex-1">
                  <ConnectButton />
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleShare}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Share Event
              </motion.button>

              {event.onchainAction && (
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href={event.onchainAction}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-center"
                >
                  View Onchain Action
                </motion.a>
              )}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
