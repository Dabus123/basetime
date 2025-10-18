'use client';

import React from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { motion } from 'framer-motion';

export function ConnectButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-2"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, duration: 0.3, ease: "backOut" }}
          className="w-2 h-2 bg-green-500 rounded-full"
        />
        <span className="text-sm text-gray-600 font-mono">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </span>
        <motion.button
          whileHover={{ scale: 1.05, y: -1 }}
          whileTap={{ scale: 0.95, y: 0 }}
          onClick={() => disconnect()}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          Disconnect
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05, y: -1 }}
      whileTap={{ scale: 0.95, y: 0 }}
      onClick={() => connect({ connector: connectors[0] })}
      disabled={isPending}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
    >
      {isPending ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
        />
      ) : (
        'Connect Wallet'
      )}
    </motion.button>
  );
}