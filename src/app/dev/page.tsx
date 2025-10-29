'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, CodeBracketIcon } from '@heroicons/react/24/outline';
import { useBaseSocial } from '@/hooks/useBaseSocial';
import { useRouter } from 'next/navigation';
import { ArrowRightIcon } from '@heroicons/react/24/solid';

export default function DevPage() {
  const router = useRouter();
  const { postToBaseSocial, isLoading, isSuccess, txHash, error } = useBaseSocial();
  const [lastTest, setLastTest] = useState<string>('');

  const testPost = async (method: string) => {
    const testData = {
      header: `Test Post - ${method.toUpperCase()}`,
      description: `Testing Base social posting via ${method} implementation at ${new Date().toLocaleTimeString()}`,
    };

    try {
      setLastTest(`Testing ${method}...`);
      await postToBaseSocial(testData);
      setLastTest(`✅ ${method} succeeded!`);
    } catch (err) {
      console.error(`Test post failed (${method}):`, err);
      setLastTest(`❌ ${method} failed: ${err}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="w-6 h-6 text-gray-600" />
            </motion.button>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <CodeBracketIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Base Social Test</h1>
                <p className="text-sm text-gray-600">Test different posting implementations</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        {/* Warning Banner */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-yellow-800">
            ⚠️ <strong>Development Mode:</strong> This page tests different Base social posting implementations to diagnose issues.
          </p>
        </div>

        {/* Status */}
        {(lastTest || isLoading || error) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-white border-2 border-gray-200 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                ) : error ? (
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✕</span>
                  </div>
                ) : (
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 mb-1">
                  {isLoading ? 'Posting...' : error ? 'Error' : 'Success'}
                </p>
                <p className="text-sm text-gray-600">{lastTest}</p>
                {txHash && (
                  <p className="text-xs text-purple-600 mt-1 font-mono">
                    TX: {txHash.substring(0, 20)}...
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Test Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Farcaster SDK */}
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🚀</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Farcaster SDK</h3>
                <p className="text-xs text-gray-600">Direct SDK integration</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-4">
              Uses <code className="bg-gray-100 px-2 py-1 rounded text-purple-600">@farcaster/miniapp-sdk</code> with <code className="bg-gray-100 px-2 py-1 rounded text-purple-600">composeCast</code> method.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => testPost('farcaster')}
              disabled={isLoading}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <ArrowRightIcon className="w-5 h-5" />
              Test Farcaster SDK
            </motion.button>
          </motion.div>

          {/* Base Docs Implementation */}
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🏛️</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Base Docs</h3>
                <p className="text-xs text-gray-600">Official documentation</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-4">
              Follows the official Base documentation pattern for social posts and casts.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => testPost('base')}
              disabled={isLoading}
              className="w-full px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <ArrowRightIcon className="w-5 h-5" />
              Test Base Docs
            </motion.button>
          </motion.div>

          {/* Zora SDK */}
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Zora SDK</h3>
                <p className="text-xs text-gray-600">Alternative implementation</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-4">
              Uses Zora's approach to Base social interactions and posting.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => testPost('zora')}
              disabled={isLoading}
              className="w-full px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <ArrowRightIcon className="w-5 h-5" />
              Test Zora SDK
            </motion.button>
          </motion.div>

          {/* Debug Info */}
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Debug Info</h3>
                <p className="text-xs text-gray-600">Current status</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium">{isLoading ? 'Loading...' : isSuccess ? 'Ready' : 'Idle'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">SDK:</span>
                <span className="font-medium font-mono text-purple-600">@farcaster/miniapp</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Mode:</span>
                <span className="font-medium">{process.env.NODE_ENV}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Implementation Details */}
        <div className="mt-8 bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Implementation Details</h2>
          <div className="space-y-3 text-sm text-gray-700">
            <div>
              <p className="font-semibold mb-1">All methods currently use:</p>
              <code className="bg-gray-100 px-2 py-1 rounded text-purple-600">
                sdk.actions.composeCast()
              </code>
            </div>
            <div className="pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-600">
                This test page helps diagnose which posting method works best with Base Social. 
                Check the console for detailed logs after each test.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

