'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useAccount } from 'wagmi';

interface CreateEventButtonProps {
  onCreateEvent: () => void;
}

export function CreateEventButton({ onCreateEvent }: CreateEventButtonProps) {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return null;
  }

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, duration: 0.3, ease: "backOut" }}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95, y: 0 }}
      onClick={onCreateEvent}
      className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl sm:w-auto sm:h-auto sm:px-4 sm:py-2 sm:gap-2"
      title="Create Event"
    >
      <motion.div
        whileHover={{ rotate: 90 }}
        transition={{ duration: 0.2 }}
      >
        <PlusIcon className="w-5 h-5 sm:w-4 sm:h-4" />
      </motion.div>
      <span className="hidden sm:inline">Create Event</span>
    </motion.button>
  );
}
