'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, CalendarIcon, ClockIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

interface ScheduledPost {
  id: string;
  header: string;
  description: string;
  scheduledFor: string;
  imageId?: string;
  image?: string;
  status?: 'pending' | 'posted' | 'failed';
}

interface ScheduledPostModalProps {
  post: ScheduledPost | null;
  onClose: () => void;
  onDelete?: (postId: string) => void;
}

export function ScheduledPostModal({ post, onClose, onDelete }: ScheduledPostModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (post) {
      setIsVisible(true);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [post]);

  // Don't render if no post is provided
  if (!post) {
    return null;
  }

  const scheduledDate = new Date(post.scheduledFor);
  const isPast = scheduledDate < new Date();
  const isToday = scheduledDate.toDateString() === new Date().toDateString();

  const handleDelete = () => {
    if (onDelete && window.confirm('Are you sure you want to delete this scheduled post?')) {
      onDelete(post.id);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 bg-blue-600 text-white">
              <div className="flex items-center gap-3">
                <CalendarIcon className="w-6 h-6" />
                <h2 className="text-xl font-semibold font-display">Scheduled Post</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Post Title */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.header}</h3>
                <p className="text-gray-600 leading-relaxed">{post.description}</p>
              </div>

              {/* Scheduled Time */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <ClockIcon className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-900">Scheduled Time</span>
                </div>
                <div className="text-gray-700">
                  <div className="font-medium">
                    {scheduledDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  <div className="text-sm">
                    {scheduledDate.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
                {isPast && (
                  <div className="mt-2 text-sm text-red-600 font-medium">
                    ⚠️ This post was scheduled for the past
                  </div>
                )}
                {isToday && !isPast && (
                  <div className="mt-2 text-sm text-green-600 font-medium">
                    ✅ Scheduled for today
                  </div>
                )}
              </div>

              {/* Status */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <DocumentTextIcon className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-900">Status</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    post.status === 'posted' ? 'bg-green-500' :
                    post.status === 'failed' ? 'bg-red-500' :
                    'bg-yellow-500'
                  }`}></div>
                  <span className="text-gray-700 capitalize">
                    {post.status === 'posted' ? 'Posted Successfully' :
                     post.status === 'failed' ? 'Failed to Post' :
                     'Pending'}
                  </span>
                </div>
              </div>

              {/* Image Preview */}
              {(post.imageId || post.image) && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <DocumentTextIcon className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-900">Image Preview</span>
                  </div>
                  <div className="bg-white rounded-lg p-4 border-2 border-dashed border-gray-300 text-center">
                    <div className="text-gray-500 text-sm">
                      📷 Image will be included in post
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      (Image preview not available in this view)
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 bg-gray-50 border-t">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-white transition-colors font-medium"
              >
                Close
              </button>
              {onDelete && (
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Delete
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
