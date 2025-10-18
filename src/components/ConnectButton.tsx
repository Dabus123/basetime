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
        className="flex items-center gap-1 sm:gap-2"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, duration: 0.3, ease: "backOut" }}
          className="w-2 h-2 bg-green-500 rounded-full"
        />
        <span className="text-xs sm:text-sm text-gray-600 font-mono hidden xs:inline">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </span>
        <motion.button
          whileHover={{ scale: 1.05, y: -1 }}
          whileTap={{ scale: 0.95, y: 0 }}
          onClick={() => disconnect()}
          className="px-2 py-1 sm:px-4 sm:py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 shadow-sm hover:shadow-md text-xs sm:text-sm"
          title="Disconnect"
        >
          <span className="hidden sm:inline">Disconnect</span>
          <span className="sm:hidden">×</span>
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
      className="px-3 py-1 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed text-sm sm:text-base"
    >
      {isPending ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full"
        />
      ) : (
        <>
          <span className="hidden sm:inline">Connect Wallet</span>
          <span className="sm:hidden">Connect</span>
        </>
      )}
    </motion.button>
  );
}