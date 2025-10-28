'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, DocumentTextIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { useBaseSocial } from '@/hooks/useBaseSocial';

export interface TBAPostData {
  header: string;
  description: string;
  image?: string;
  imageHeader?: string;
  imageDescription?: string;
}

interface TBAPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  selectedTimeslot?: number | null;
  onSubmit: (data: TBAPostData) => void;
  onSchedule?: (data: TBAPostData, scheduledFor: Date) => void;
}

export function TBAPostModal({ 
  isOpen, 
  onClose, 
  selectedDate,
  selectedTimeslot,
  onSubmit, 
  onSchedule 
}: TBAPostModalProps) {
  const [formData, setFormData] = useState<TBAPostData>({
    header: '',
    description: '',
    image: '',
    imageHeader: '',
    imageDescription: '',
  });
  
  const [selectedTime, setSelectedTime] = useState(() => {
    // If a timeslot is selected, use that time; otherwise default to 2 PM
    if (selectedTimeslot !== null && selectedTimeslot !== undefined) {
      return `${String(selectedTimeslot).padStart(2, '0')}:00`;
    }
    return '14:00'; // Default to 2 PM
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPostingNow, setIsPostingNow] = useState(false);
  // Image upload removed for scheduling flow
  
  // Base Social hook
  const { postToBaseSocial, isLoading: isPosting, isSuccess: postSuccess, txHash } = useBaseSocial();

  const formatDate = (date: Date | null) => {
    if (!date) return 'Select a date';
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleChange = (field: keyof TBAPostData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Upload removed

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const postData = {
        header: formData.header,
        description: formData.description,
      } as TBAPostData;
      
      // If onSchedule is provided, schedule the post instead of posting immediately
      if (onSchedule) {
        // Combine date and time
        const [hours, minutes] = selectedTime.split(':').map(Number);
        const scheduledDateTime = new Date(selectedDate);
        scheduledDateTime.setHours(hours, minutes, 0, 0);
        
        onSchedule(postData, scheduledDateTime);
        console.log('📅 Post scheduled for:', scheduledDateTime);
        alert(`✅ Post scheduled for ${scheduledDateTime.toLocaleString()}!\n\nYou'll be prompted to post when it's time.`);
      } else {
        await onSubmit(postData);
      }
      
      // Reset form
      setFormData({
        header: '',
        description: '',
      });
      onClose();
    } catch (error) {
      console.error('Error submitting TBA post:', error);
      alert('Failed to submit post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePostNow = async () => {
    setIsPostingNow(true);
    
    try {
      const postData = {
        header: formData.header,
        description: formData.description,
        imageUrl: '',
        imageHeader: '',
        imageDescription: '',
      };
      
      console.log('📝 Posting to Base social feed NOW:', postData);
      
      // Post to Base social feed
      await postToBaseSocial(postData);
      
      // Show success
      if (txHash) {
        alert(`✅ Post published successfully!\n\nTransaction: ${txHash.substring(0, 10)}...\n\nCheck console for details.`);
      } else {
        alert('✅ Post published successfully!\n\nCheck console for details.');
      }
      
      // Reset form
      setFormData({
        header: '',
        description: '',
      });
      onClose();
    } catch (error) {
      console.error('Error posting:', error);
      alert('Failed to post. Please try again.');
    } finally {
      setIsPostingNow(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.header.trim() !== '' &&
      formData.description.trim() !== ''
    );
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
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                    <SparklesIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold font-display">Schedule TBA Post</h2>
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

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-6">
                {/* Post Header */}
                <div>
                  <label htmlFor="header" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <DocumentTextIcon className="w-4 h-4 text-blue-600" />
                    Post Header
                  </label>
                  <input
                    type="text"
                    id="header"
                    value={formData.header}
                    onChange={(e) => handleChange('header', e.target.value)}
                    placeholder="Enter a catchy header for your post..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                    required
                  />
                </div>

                {/* Post Description */}
                <div>
                  <label htmlFor="description" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <DocumentTextIcon className="w-4 h-4 text-blue-600" />
                    Post Description
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Describe your TBA announcement..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none resize-none"
                    required
                  />
                </div>

                {/* Schedule Time */}
                <div>
                  <label htmlFor="time" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <SparklesIcon className="w-4 h-4 text-blue-600" />
                    Schedule Time
                  </label>
                  <input
                    type="time"
                    id="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Scheduled for: {selectedDate.toLocaleDateString()} at {selectedTime}
                  </p>
                </div>

                {/* Image upload removed */}

              </div>

              {/* Footer Actions */}
              <div className="p-6 border-t border-gray-100 bg-gray-50 flex-shrink-0">
                <div className="flex items-center justify-between gap-3">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    disabled={isSubmitting || isPostingNow}
                    className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-white transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </motion.button>
                  
                  <div className="flex flex-col gap-3">
                    {/* Schedule Post Button - Centered (Post Now button removed) */}
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={!isFormValid() || isSubmitting || isPostingNow}
                      className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Scheduling...
                        </>
                      ) : (
                        <>
                          <SparklesIcon className="w-5 h-5" />
                          Schedule Post
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

