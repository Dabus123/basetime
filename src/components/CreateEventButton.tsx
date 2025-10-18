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
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
    >
      <motion.div
        whileHover={{ rotate: 90 }}
        transition={{ duration: 0.2 }}
      >
        <PlusIcon className="w-4 h-4" />
      </motion.div>
      Create Event
    </motion.button>
  );
}
