'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { CreateEventData } from '@/types';

// Utility function to generate .ics content
const generateICS = (eventData: CreateEventData): string => {
  const startDate = new Date(eventData.startTime);
  const endDate = new Date(eventData.endTime);
  
  // Format dates for ICS (YYYYMMDDTHHMMSSZ) - UTC format
  const formatICSDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  };
  
  // Generate unique UID
  const uid = `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}@basetime.app`;
  const now = new Date();
  
  // Escape special characters for ICS format
  const escapeICS = (text: string): string => {
    return text
      .replace(/\\/g, '\\\\')
      .replace(/;/g, '\\;')
      .replace(/,/g, '\\,')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '');
  };
  
  // Build ICS content with proper line folding (max 75 chars per line)
  const foldLine = (line: string): string => {
    if (line.length <= 75) return line;
    const lines = [];
    const currentLine = line.substring(0, 75);
    lines.push(currentLine);
    
    for (let i = 75; i < line.length; i += 74) {
      const nextLine = ' ' + line.substring(i, i + 74);
      lines.push(nextLine);
    }
    
    return lines.join('\r\n');
  };
  
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//BaseTime//Event Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${formatICSDate(now)}`,
    `DTSTART:${formatICSDate(startDate)}`,
    `DTEND:${formatICSDate(endDate)}`,
    `SUMMARY:${escapeICS(eventData.name)}`,
    `DESCRIPTION:${escapeICS(eventData.description)}`,
    'STATUS:CONFIRMED',
    'TRANSP:OPAQUE',
    'CLASS:PUBLIC'
  ];
  
  // Add optional fields
  if (eventData.image) {
    lines.push(`URL:${eventData.image}`);
  }
  if (eventData.onchainAction) {
    lines.push(`URL:${eventData.onchainAction}`);
  }
  
  lines.push('END:VEVENT');
  lines.push('END:VCALENDAR');
  
  // Apply line folding and join with CRLF
  return lines.map(foldLine).join('\r\n');
};

// Utility function to download .ics file
const downloadICS = (content: string, filename: string) => {
  // Create blob with proper MIME type for calendar files
  const blob = new Blob([content], { 
    type: 'text/calendar;charset=utf-8'
  });
  
  // Simple download approach that works reliably
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  
  // Add to DOM, click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object
  setTimeout(() => URL.revokeObjectURL(url), 100);
};

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (eventData: CreateEventData) => void;
  isLoading?: boolean;
  selectedDate?: Date | null;
  selectedEndDate?: Date | null;
}

export function CreateModal({ isOpen, onClose, onSubmit, isLoading = false, selectedDate, selectedEndDate }: CreateModalProps) {
  const [formData, setFormData] = useState<CreateEventData>({
    name: '',
    description: '',
    startTime: '',
    endTime: '',
    image: '',
    onchainAction: '',
    isPublic: false,
  });

  // Set default date when selectedDate changes
  useEffect(() => {
    if (selectedDate) {
      const dateStr = selectedDate.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:MM
      setFormData(prev => ({
        ...prev,
        startTime: dateStr,
        endTime: selectedEndDate ? selectedEndDate.toISOString().slice(0, 16) : dateStr,
      }));
    }
  }, [selectedDate, selectedEndDate]);

  const [errors, setErrors] = useState<Partial<CreateEventData>>({});

  const handleInputChange = (field: keyof CreateEventData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateEventData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Event name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Event description is required';
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    }

    if (formData.startTime && formData.endTime) {
      const start = new Date(formData.startTime);
      const end = new Date(formData.endTime);
      
      if (start >= end) {
        newErrors.endTime = 'End time must be after start time';
      }
      
      if (start < new Date()) {
        newErrors.startTime = 'Start time must be in the future';
      }
    }

    if (formData.image && !isValidUrl(formData.image)) {
      newErrors.image = 'Please enter a valid image URL';
    }

    if (formData.onchainAction && !isValidUrl(formData.onchainAction)) {
      newErrors.onchainAction = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      startTime: '',
      endTime: '',
      image: '',
      onchainAction: '',
      isPublic: false,
    });
    setErrors({});
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 bg-blue-600 text-white rounded-t-xl">
              <h2 className="text-xl font-semibold font-display">Create Event</h2>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Event Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter event name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 ${
                    errors.description ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Describe your event"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              {/* Start Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time *
                </label>
                <input
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={(e) => handleInputChange('startTime', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 ${
                    errors.startTime ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.startTime && (
                  <p className="mt-1 text-sm text-red-600">{errors.startTime}</p>
                )}
              </div>

              {/* End Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Time *
                </label>
                <input
                  type="datetime-local"
                  value={formData.endTime}
                  onChange={(e) => handleInputChange('endTime', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 ${
                    errors.endTime ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.endTime && (
                  <p className="mt-1 text-sm text-red-600">{errors.endTime}</p>
                )}
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => handleInputChange('image', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 ${
                    errors.image ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="https://example.com/image.jpg"
                />
                {errors.image && (
                  <p className="mt-1 text-sm text-red-600">{errors.image}</p>
                )}
              </div>

              {/* Onchain Action */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Onchain Action URL
                </label>
                <input
                  type="url"
                  value={formData.onchainAction}
                  onChange={(e) => handleInputChange('onchainAction', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 ${
                    errors.onchainAction ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="https://example.com/mint"
                />
                {errors.onchainAction && (
                  <p className="mt-1 text-sm text-red-600">{errors.onchainAction}</p>
                )}
              </div>

              {/* Public Event Checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={formData.isPublic || false}
                  onChange={(e) => handleInputChange('isPublic', e.target.checked)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700">
                  Make this a public event
                </label>
              </div>

              {/* Export .ics Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={(event) => {
                    if (formData.name && formData.startTime && formData.endTime) {
                      const icsContent = generateICS(formData);
                      const filename = `${formData.name.replace(/[^a-zA-Z0-9]/g, '_')}.ics`;
                      
                      // Show a brief notification
                      const button = event.target as HTMLButtonElement;
                      const originalText = button.textContent;
                      button.textContent = 'Downloading...';
                      button.disabled = true;
                      
                      setTimeout(() => {
                        button.textContent = originalText;
                        button.disabled = false;
                      }, 1500);
                      
                      downloadICS(icsContent, filename);
                    }
                  }}
                  disabled={!formData.name || !formData.startTime || !formData.endTime}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Export as .ics
                </button>
                <p className="text-xs text-gray-500 mt-1 text-center">
                  Download calendar file for Google Calendar, Outlook, etc.
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Creating...
                    </div>
                  ) : (
                    'Create Event'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
