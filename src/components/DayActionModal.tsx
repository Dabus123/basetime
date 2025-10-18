'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';

interface DayActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  onCreateEvent: () => void;
  onScheduleTBA: () => void;
}

export function DayActionModal({ 
  isOpen, 
  onClose, 
  selectedDate, 
  onCreateEvent, 
  onScheduleTBA 
}: DayActionModalProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">What would you like to do?</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {formatDate(selectedDate)}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-gray-600" />
              </motion.button>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {/* Create Event Option */}
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={onCreateEvent}
                className="w-full p-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-3"
              >
                <motion.div
                  whileHover={{ rotate: 15 }}
                  transition={{ duration: 0.2 }}
                  className="p-2 bg-white bg-opacity-20 rounded-lg"
                >
                  <CalendarIcon className="w-6 h-6" />
                </motion.div>
                <div className="text-left">
                  <div className="font-semibold">Create Event</div>
                  <div className="text-sm text-blue-100">Schedule a specific event with details</div>
                </div>
              </motion.button>

              {/* Schedule TBA Option */}
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={onScheduleTBA}
                className="w-full p-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-3"
              >
                <motion.div
                  whileHover={{ rotate: 15 }}
                  transition={{ duration: 0.2 }}
                  className="p-2 bg-gray-200 rounded-lg"
                >
                  <ClockIcon className="w-6 h-6" />
                </motion.div>
                <div className="text-left">
                  <div className="font-semibold">Schedule TBA Post</div>
                  <div className="text-sm text-gray-500">Create a placeholder for future details</div>
                </div>
              </motion.button>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                Choose how you&apos;d like to plan for this day
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
