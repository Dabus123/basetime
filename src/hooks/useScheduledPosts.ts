'use client';

import { useState, useEffect } from 'react';
import { TBAPostData } from '@/components/TBAPostModal';

export interface ScheduledPost extends TBAPostData {
  id: string;
  scheduledFor: Date;
  status: 'pending' | 'posted' | 'cancelled';
  createdAt: Date;
}

const STORAGE_KEY = 'basetime_scheduled_posts';

export function useScheduledPosts() {
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const posts = JSON.parse(stored).map((post: any) => ({
          ...post,
          scheduledFor: new Date(post.scheduledFor),
          createdAt: new Date(post.createdAt),
        }));
        setScheduledPosts(posts);
      } catch (error) {
        console.error('Error loading scheduled posts:', error);
      }
    }
  }, []);

  // Save to localStorage whenever scheduledPosts changes
  useEffect(() => {
    if (scheduledPosts.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(scheduledPosts));
    }
  }, [scheduledPosts]);

  const addScheduledPost = (postData: TBAPostData, scheduledFor: Date) => {
    const newPost: ScheduledPost = {
      ...postData,
      id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      scheduledFor,
      status: 'pending',
      createdAt: new Date(),
    };

    setScheduledPosts((prev) => [...prev, newPost]);
    return newPost;
  };

  const updatePostStatus = (id: string, status: ScheduledPost['status']) => {
    setScheduledPosts((prev) =>
      prev.map((post) => (post.id === id ? { ...post, status } : post))
    );
  };

  const removePost = (id: string) => {
    setScheduledPosts((prev) => prev.filter((post) => post.id !== id));
  };

  const getPendingPosts = () => {
    return scheduledPosts.filter(
      (post) => post.status === 'pending'
    );
  };

  const getDuePosts = () => {
    const now = new Date();
    return scheduledPosts.filter(
      (post) => post.status === 'pending' && post.scheduledFor <= now
    );
  };

  return {
    scheduledPosts,
    addScheduledPost,
    updatePostStatus,
    removePost,
    getPendingPosts,
    getDuePosts,
  };
}



