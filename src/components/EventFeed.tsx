'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarIcon, ListBulletIcon } from '@heroicons/react/24/outline';
import { Event } from '@/types';
import { EventCard } from './EventCard';
import { CalendarView } from './CalendarView';

interface EventFeedProps {
  events: Event[];
  onRSVP: (eventId: number) => void;
  onShare: (event: Event) => void;
  userRSVPs: Set<number>;
  isLoading?: boolean;
  onCreateEvent?: (date: Date) => void;
  viewMode?: 'list' | 'calendar';
}

type ViewMode = 'list' | 'calendar';

export function EventFeed({
  events,
  onRSVP,
  onShare,
  userRSVPs,
  isLoading = false,
  onCreateEvent,
  viewMode: externalViewMode,
}: EventFeedProps) {
  const [internalViewMode, setInternalViewMode] = useState<ViewMode>('calendar');
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'live' | 'ended'>('all');
  
  // Use external viewMode if provided, otherwise use internal state
  const viewMode = externalViewMode || internalViewMode;

  const filteredEvents = events.filter(event => {
    const now = Math.floor(Date.now() / 1000);
    const isLive = event.startTime <= now && event.endTime >= now;
    const isUpcoming = event.startTime > now;
    const isEnded = event.endTime < now;

    switch (filter) {
      case 'live':
        return isLive;
      case 'upcoming':
        return isUpcoming;
      case 'ended':
        return isEnded;
      default:
        return true;
    }
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    // Live events first, then upcoming, then ended
    const now = Math.floor(Date.now() / 1000);
    const aLive = a.startTime <= now && a.endTime >= now;
    const bLive = b.startTime <= now && b.endTime >= now;
    const aUpcoming = a.startTime > now;
    const bUpcoming = b.startTime > now;

    if (aLive && !bLive) return -1;
    if (!aLive && bLive) return 1;
    if (aUpcoming && !bUpcoming) return -1;
    if (!aUpcoming && bUpcoming) return 1;
    
    return a.startTime - b.startTime;
  });

  // Debug: Check for duplicate events
  console.log('EventFeed - sortedEvents:', sortedEvents.map(e => ({ id: e.id, name: e.name })));

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 animate-pulse">
            <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="flex gap-2">
              <div className="h-8 bg-gray-200 rounded flex-1"></div>
              <div className="h-8 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 pt-4 pb-2 flex-shrink-0">
        <div className="min-w-0 flex-1">
          <p className="text-blue-700">{sortedEvents.length} events found</p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Filter Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="flex bg-blue-100 rounded-lg p-1"
          >
            {[
              { key: 'all', label: 'All' },
              { key: 'upcoming', label: 'Upcoming' },
              { key: 'live', label: 'Live' },
              { key: 'ended', label: 'Ended' },
            ].map(({ key, label }) => (
              <motion.button
                key={key}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(key as 'all' | 'upcoming' | 'live' | 'ended')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-all duration-200 ${
                  filter === key
                    ? 'bg-white text-blue-900 shadow-sm'
                    : 'text-blue-600 hover:text-blue-900'
                }`}
              >
                {label}
              </motion.button>
            ))}
          </motion.div>

          {/* View Mode Toggle - Only show when no external viewMode is provided */}
          {!externalViewMode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="flex bg-blue-100 rounded-lg p-1"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setInternalViewMode('list')}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === 'list'
                    ? 'bg-white text-blue-900 shadow-sm'
                    : 'text-blue-600 hover:text-blue-900'
                }`}
              >
                <ListBulletIcon className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setInternalViewMode('calendar')}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === 'calendar'
                    ? 'bg-white text-blue-900 shadow-sm'
                    : 'text-blue-600 hover:text-blue-900'
                }`}
              >
                <CalendarIcon className="w-4 h-4" />
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Events Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {sortedEvents.length === 0 ? (
          <div className="text-center py-12">
            <CalendarIcon className="w-16 h-16 text-blue-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-blue-900 mb-2">No events found</h3>
            <p className="text-blue-700">
              {filter === 'all' 
                ? 'No events have been created yet.' 
                : `No ${filter} events found.`}
            </p>
          </div>
        ) : (
          <>
            {viewMode === 'list' ? (
              <div className="space-y-4">
                {sortedEvents.map((event, index) => (
                  <EventCard
                    key={`${event.id}-${index}`}
                    event={event}
                    onRSVP={onRSVP}
                    onShare={onShare}
                    hasRSVPed={userRSVPs.has(event.id)}
                  />
                ))}
              </div>
            ) : (
              <>
                <CalendarView
                  events={sortedEvents}
                  onRSVP={onRSVP}
                  onShare={onShare}
                  userRSVPs={userRSVPs}
                  onCreateEvent={onCreateEvent}
                />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
