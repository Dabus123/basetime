'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, CodeBracketIcon } from '@heroicons/react/24/outline';
import { useBaseSocial } from '@/hooks/useBaseSocial';

interface DevMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DevMenu({ isOpen, onClose }: DevMenuProps) {
  const { postToBaseSocial } = useBaseSocial();

  const testPost = async (method: 'farcaster' | 'base' | 'zora') => {
    const testData = {
      header: `Test Post - ${method.toUpperCase()}`,
      description: `Testing Base social posting via ${method} implementation at ${new Date().toLocaleTimeString()}`,
    };

    try {
      await postToBaseSocial(testData);
      alert(`✅ Test post sent using ${method} implementation!`);
    } catch (error) {
      console.error(`Test post failed (${method}):`, error);
      alert(`❌ Test post failed: ${error}`);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 flex items-center justify-center p-4 z-[101]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                      <CodeBracketIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold font-display">DEV MENU</h2>
                      <p className="text-purple-100 text-sm">Test Base Social Posting</p>
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
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <p className="text-sm text-yellow-800">
                    ⚠️ This is a development menu for testing different Base social posting implementations.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-700">Test Implementation Methods:</h3>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => testPost('farcaster')}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <span>🚀 Farcaster SDK</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => testPost('base')}
                    className="w-full px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <span>🏛️ Base Docs</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => testPost('zora')}
                    className="w-full px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <span>⚡ Zora SDK</span>
                  </motion.button>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 text-center">
                    Implementation methods are configured in: <code className="bg-gray-100 px-2 py-1 rounded text-purple-600">src/hooks/useBaseSocial.ts</code>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

