'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, CalendarIcon, ClockIcon, UserGroupIcon, ShareIcon, CheckIcon } from '@heroicons/react/24/outline';
import { Event } from '@/types';
import { formatDate, formatTime, getEventStatus } from '@/utils/helpers';

interface EventModalProps {
  event: Event | null;
  onClose: () => void;
  onRSVP: (eventId: number) => void;
  onShare: (event: Event) => void;
  hasRSVPed: boolean;
}

export function EventModal({ event, onClose, onRSVP, onShare, hasRSVPed }: EventModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);
  
  // Don't render if no event is provided
  if (!event) {
    return null;
  }
  
  const eventStatus = getEventStatus(event.startTime, event.endTime);

  const handleRSVP = () => {
    onRSVP(event.id);
  };

  const handleShare = () => {
    onShare(event);
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for exit animation
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        onClick={handleClose}
      >
        <motion.div
          initial={{ 
            scale: 0.8, 
            opacity: 0, 
            y: 50,
            rotateX: -15
          }}
          animate={{ 
            scale: isVisible ? 1 : 0.8, 
            opacity: isVisible ? 1 : 0, 
            y: isVisible ? 0 : 50,
            rotateX: isVisible ? 0 : -15
          }}
          exit={{ 
            scale: 0.8, 
            opacity: 0, 
            y: 50,
            rotateX: 15
          }}
          transition={{ 
            duration: 0.4, 
            ease: [0.25, 0.46, 0.45, 0.94],
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform-gpu"
          onClick={(e) => e.stopPropagation()}
          style={{ 
            transformStyle: 'preserve-3d',
            perspective: '1000px'
          }}
        >
          {/* Header with Parallax Image */}
          <div className="relative overflow-hidden">
            <motion.img
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
              src={event.image}
              alt={event.name}
              className="w-full h-48 object-cover"
            />
            
            {/* Gradient Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"
            />
            
            {/* Close Button */}
            <motion.button
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, duration: 0.4, ease: "backOut" }}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 bg-white bg-opacity-90 backdrop-blur-sm rounded-full hover:bg-opacity-100 transition-all shadow-lg"
            >
              <XMarkIcon className="w-5 h-5 text-gray-600" />
            </motion.button>
            
            {/* Event Info Overlay */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
              className="absolute bottom-4 left-4 right-4"
            >
              <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                  className="text-2xl font-bold text-gray-900 mb-2"
                >
                  {event.name}
                </motion.h2>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.4 }}
                  className="flex items-center gap-4 text-sm text-gray-600"
                >
                  <div className="flex items-center gap-1">
                    <UserGroupIcon className="w-4 h-4" />
                    <span>{event.rsvpCount} RSVPs</span>
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8, duration: 0.3, ease: "backOut" }}
                    className={`
                      px-3 py-1 rounded-full text-xs font-medium
                      ${eventStatus === 'upcoming' ? 'bg-green-100 text-green-800' : 
                        eventStatus === 'live' ? 'bg-blue-100 text-blue-800 animate-pulse' : 
                        'bg-gray-100 text-gray-800'}
                    `}
                  >
                    {eventStatus === 'upcoming' ? 'Upcoming' : 
                     eventStatus === 'live' ? 'Live Now' : 'Ended'}
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Content with Sequential Reveals */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
            className="p-6"
          >
            {/* Event Details */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.4 }}
              className="space-y-4 mb-6"
            >
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.0, duration: 0.4 }}
                className="flex items-start gap-3"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 1.1, duration: 0.4, ease: "backOut" }}
                >
                  <CalendarIcon className="w-5 h-5 text-blue-500 mt-0.5" />
                </motion.div>
                <div>
                  <p className="font-medium text-gray-900">Date & Time</p>
                  <p className="text-gray-600">
                    {formatDate(event.startTime)} at {formatTime(event.startTime)}
                  </p>
                  {event.endTime !== event.startTime && (
                    <p className="text-sm text-gray-500">
                      Ends {formatDate(event.endTime)} at {formatTime(event.endTime)}
                    </p>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.4 }}
                className="flex items-start gap-3"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 1.3, duration: 0.4, ease: "backOut" }}
                >
                  <ClockIcon className="w-5 h-5 text-purple-500 mt-0.5" />
                </motion.div>
                <div>
                  <p className="font-medium text-gray-900">Duration</p>
                  <p className="text-gray-600">
                    {Math.round((event.endTime - event.startTime) / 3600)} hours
                  </p>
                </div>
              </motion.div>

              {event.onchainAction && (
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1.4, duration: 0.4 }}
                  className="flex items-start gap-3"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 1.5, duration: 0.4, ease: "backOut" }}
                  >
                    <ShareIcon className="w-5 h-5 text-green-500 mt-0.5" />
                  </motion.div>
                  <div>
                    <p className="font-medium text-gray-900">Onchain Action</p>
                    <a
                      href={event.onchainAction}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 underline"
                    >
                      View Action
                    </a>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.6, duration: 0.4 }}
              className="mb-6"
            >
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{event.description}</p>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.7, duration: 0.4 }}
              className="flex gap-3"
            >
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98, y: 0 }}
                onClick={handleRSVP}
                disabled={hasRSVPed || eventStatus === 'ended'}
                className={`
                  flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg
                  ${hasRSVPed 
                    ? 'bg-green-100 text-green-800 cursor-not-allowed' 
                    : eventStatus === 'ended'
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-xl'
                  }
                `}
              >
                {hasRSVPed ? (
                  <>
                    <CheckIcon className="w-5 h-5" />
                    RSVP&apos;d
                  </>
                ) : eventStatus === 'ended' ? (
                  'Event Ended'
                ) : (
                  'RSVP Now'
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98, y: 0 }}
                onClick={handleShare}
                className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:shadow-lg transition-all duration-200"
              >
                <ShareIcon className="w-5 h-5" />
                Share
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
