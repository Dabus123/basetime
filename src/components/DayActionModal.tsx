'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, CalendarIcon, ClockIcon, SparklesIcon } from '@heroicons/react/24/outline';

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
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                    <SparklesIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Plan Your Day</h2>
                    <p className="text-blue-100 text-sm">
                      {formatDate(selectedDate)}
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Options */}
              <div className="space-y-4">
                {/* Create Event Option */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onCreateEvent}
                  className="w-full p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-4 group"
                >
                  <motion.div
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                    className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-sm"
                  >
                    <CalendarIcon className="w-6 h-6 text-white" />
                  </motion.div>
                  <div className="text-left flex-1">
                    <div className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                      Create Event
                    </div>
                    <div className="text-sm text-gray-600 group-hover:text-blue-600 transition-colors">
                      Schedule a specific event with all the details
                    </div>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-blue-500 group-hover:text-blue-600"
                  >
                    →
                  </motion.div>
                </motion.button>

                {/* Schedule TBA Option */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onScheduleTBA}
                  className="w-full p-5 bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-2xl hover:from-gray-100 hover:to-slate-100 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-4 group"
                >
                  <motion.div
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                    className="p-3 bg-gradient-to-br from-gray-400 to-slate-500 rounded-xl shadow-sm"
                  >
                    <ClockIcon className="w-6 h-6 text-white" />
                  </motion.div>
                  <div className="text-left flex-1">
                    <div className="font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                      Schedule TBA Post
                    </div>
                    <div className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
                      Create a placeholder for future details
                    </div>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-gray-500 group-hover:text-gray-600"
                  >
                    →
                  </motion.div>
                </motion.button>
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 text-center">
                  Choose how you&apos;d like to plan for this day
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}