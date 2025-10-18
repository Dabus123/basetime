'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Event } from '@/types';
import { formatDateTime, isEventLive, isEventUpcoming, getTimeUntilEvent, truncateText } from '@/utils/helpers';
import { CalendarIcon, ClockIcon, UserGroupIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

interface EventCardProps {
  event: Event;
  onRSVP: (eventId: number) => void;
  onShare: (event: Event) => void;
  hasRSVPed?: boolean;
  isRSVPLoading?: boolean;
  className?: string;
}

export function EventCard({
  event,
  onRSVP,
  onShare,
  hasRSVPed = false,
  isRSVPLoading = false,
  className = '',
}: EventCardProps) {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow ${className}`}
    >
      {/* Event Image */}
      <div className="relative h-48 bg-gradient-to-br from-blue-50 to-purple-50">
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
            <CalendarIcon className="w-16 h-16 text-gray-300" />
          </div>
        )}
        
        {/* Status Badge */}
        <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor()}`}>
          {getStatusText()}
        </div>
      </div>

      {/* Event Content */}
      <div className="p-4">
        {/* Event Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {event.name}
        </h3>

        {/* Event Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {truncateText(event.description, 120)}
        </p>

        {/* Event Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <ClockIcon className="w-4 h-4 mr-2" />
            <span>{formatDateTime(event.startTime)}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <UserGroupIcon className="w-4 h-4 mr-2" />
            <span>{event.rsvpCount} RSVPs</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onRSVP(event.id)}
            disabled={isRSVPLoading || eventStatus === 'ended' || hasRSVPed}
            className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              hasRSVPed
                ? 'bg-green-100 text-green-800 cursor-not-allowed'
                : eventStatus === 'ended'
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isRSVPLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                RSVPing...
              </div>
            ) : hasRSVPed ? (
              'RSVPed ✓'
            ) : (
              'RSVP'
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onShare(event)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Share
          </motion.button>

          {event.onchainAction && (
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href={event.onchainAction}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <ArrowTopRightOnSquareIcon className="w-4 h-4" />
            </motion.a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
