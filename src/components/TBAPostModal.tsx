'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, PhotoIcon, DocumentTextIcon, SparklesIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { useBaseSocial } from '@/hooks/useBaseSocial';

export interface TBAPostData {
  header: string;
  description: string;
  image: string;
  imageHeader: string;
  imageDescription: string;
}

interface TBAPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  onSubmit: (data: TBAPostData) => void;
  onSchedule?: (data: TBAPostData, scheduledFor: Date) => void;
}

export function TBAPostModal({ 
  isOpen, 
  onClose, 
  selectedDate,
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPostingNow, setIsPostingNow] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Base Social hook
  const { postToBaseSocial, isLoading: isPosting, isSuccess: postSuccess, txHash } = useBaseSocial();

  const formatDate = (date: Date) => {
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 10MB for images)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        alert(`File is too large! Maximum size is 10MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB`);
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file (PNG, JPG, GIF, WebP, etc.)');
        return;
      }
      
      setSelectedFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadToIPFS = async (file: File): Promise<string> => {
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Debug: Check if env vars are loaded
      console.log('🔑 JWT Token loaded:', process.env.NEXT_PUBLIC_PINATA_JWT ? 'Yes' : 'No');
      console.log('🔑 JWT Token (first 20 chars):', process.env.NEXT_PUBLIC_PINATA_JWT?.substring(0, 20) || 'Not loaded');
      
      // Use new Pinata v3 API
      const formData = new FormData();
      formData.append('file', file);
      formData.append('network', 'public'); // Use public network

      const response = await fetch('https://uploads.pinata.cloud/v3/files', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT || ''}`
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Pinata API Error:', response.status, errorText);
        throw new Error(`Failed to upload to IPFS: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Upload successful:', result);
      
      // New API returns data in result.data
      const cid = result.data?.cid || result.cid;
      const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${cid}`;
      
      setUploadProgress(100);
      setIsUploading(false);
      
      return ipfsUrl;
    } catch (error) {
      console.error('IPFS upload error:', error);
      setIsUploading(false);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Upload image to IPFS if a file is selected
      let imageUrl = formData.image;
      if (selectedFile) {
        imageUrl = await uploadToIPFS(selectedFile);
        console.log('✅ Image uploaded to IPFS:', imageUrl);
      }
      
      const postData = {
        ...formData,
        image: imageUrl,
      };
      
      // If onSchedule is provided, schedule the post instead of posting immediately
      if (onSchedule) {
        onSchedule(postData, selectedDate);
        console.log('📅 Post scheduled for:', selectedDate);
        alert(`✅ Post scheduled for ${selectedDate.toLocaleDateString()}!\n\nYou'll be prompted to post when it's time.`);
      } else {
        await onSubmit(postData);
      }
      
      // Reset form
      setFormData({
        header: '',
        description: '',
        image: '',
        imageHeader: '',
        imageDescription: '',
      });
      setSelectedFile(null);
      setImagePreview('');
      onClose();
    } catch (error) {
      console.error('Error submitting TBA post:', error);
      alert('Failed to upload image or submit post. Please try again.');
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  const handlePostNow = async () => {
    setIsPostingNow(true);
    
    try {
      // Upload image to IPFS if a file is selected
      let imageUrl = formData.image;
      if (selectedFile) {
        imageUrl = await uploadToIPFS(selectedFile);
        console.log('✅ Image uploaded to IPFS:', imageUrl);
      }
      
      const postData = {
        header: formData.header,
        description: formData.description,
        imageUrl,
        imageHeader: formData.imageHeader,
        imageDescription: formData.imageDescription,
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
        image: '',
        imageHeader: '',
        imageDescription: '',
      });
      setSelectedFile(null);
      setImagePreview('');
      onClose();
    } catch (error) {
      console.error('Error posting:', error);
      alert('Failed to post. Please try again.');
    } finally {
      setIsPostingNow(false);
      setIsUploading(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.header.trim() !== '' &&
      formData.description.trim() !== '' &&
      (selectedFile || formData.image.trim() !== '') &&
      formData.imageHeader.trim() !== '' &&
      formData.imageDescription.trim() !== '' &&
      !isUploading
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
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6 text-white flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                    <SparklesIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold font-display">Schedule TBA Post</h2>
                    <p className="text-purple-100 text-sm">
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
                    <DocumentTextIcon className="w-4 h-4 text-purple-600" />
                    Post Header
                  </label>
                  <input
                    type="text"
                    id="header"
                    value={formData.header}
                    onChange={(e) => handleChange('header', e.target.value)}
                    placeholder="Enter a catchy header for your post..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 outline-none"
                    required
                  />
                </div>

                {/* Post Description */}
                <div>
                  <label htmlFor="description" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <DocumentTextIcon className="w-4 h-4 text-purple-600" />
                    Post Description
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Describe your TBA announcement..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 outline-none resize-none"
                    required
                  />
                </div>

                {/* Divider */}
                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-medium">Image Details</span>
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <PhotoIcon className="w-4 h-4 text-purple-600" />
                    Upload Image
                  </label>
                  
                  {/* File Input */}
                  <div className="relative">
                    <input
                      type="file"
                      id="image"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      disabled={isUploading || isSubmitting}
                    />
                    <label
                      htmlFor="image"
                      className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                        isUploading || isSubmitting
                          ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
                          : imagePreview
                          ? 'border-purple-300 bg-purple-50 hover:bg-purple-100'
                          : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-purple-400'
                      }`}
                    >
                      {imagePreview ? (
                        <div className="flex items-center gap-2 text-purple-600">
                          <ArrowUpTrayIcon className="w-5 h-5" />
                          <span className="text-sm font-medium">Change Image</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <ArrowUpTrayIcon className="w-8 h-8 text-gray-400" />
                          <div className="text-sm text-gray-600 text-center">
                            <span className="font-medium text-purple-600">Click to upload</span> or drag and drop
                          </div>
                          <div className="text-xs text-gray-500">PNG, JPG, GIF, WebP up to 10MB</div>
                          {selectedFile && (
                            <div className="text-xs text-green-600 font-medium">
                              Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                            </div>
                          )}
                        </div>
                      )}
                    </label>
                  </div>

                  {/* Upload Progress */}
                  {isUploading && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>Uploading to IPFS...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Image Preview */}
                  {imagePreview && !isUploading && (
                    <div className="mt-3 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Image Header */}
                <div>
                  <label htmlFor="imageHeader" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <DocumentTextIcon className="w-4 h-4 text-purple-600" />
                    Image Header
                  </label>
                  <input
                    type="text"
                    id="imageHeader"
                    value={formData.imageHeader}
                    onChange={(e) => handleChange('imageHeader', e.target.value)}
                    placeholder="Header text for the image..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 outline-none"
                    required
                  />
                </div>

                {/* Image Description */}
                <div>
                  <label htmlFor="imageDescription" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <DocumentTextIcon className="w-4 h-4 text-purple-600" />
                    Image Description
                  </label>
                  <textarea
                    id="imageDescription"
                    value={formData.imageDescription}
                    onChange={(e) => handleChange('imageDescription', e.target.value)}
                    placeholder="Describe what the image shows..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 outline-none resize-none"
                    required
                  />
                </div>
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
                  
                  <div className="flex items-center gap-3">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handlePostNow}
                      disabled={!isFormValid() || isSubmitting || isPostingNow || isPosting}
                      className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {(isPostingNow || isPosting) ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          {isPosting ? 'Confirming...' : 'Posting...'}
                        </>
                      ) : (
                        <>
                          <ArrowUpTrayIcon className="w-5 h-5" />
                          Post Now
                        </>
                      )}
                    </motion.button>
                    
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={!isFormValid() || isSubmitting || isPostingNow}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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

