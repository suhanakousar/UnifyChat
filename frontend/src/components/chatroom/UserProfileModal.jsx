import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaEnvelope, FaCalendarAlt } from 'react-icons/fa';
import { AvatarPerson } from './ReusableComponents';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';

const UserProfileModal = ({ isOpen, onClose, userId, currentUserId }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && userId) {
      fetchUserProfile();
    }
  }, [isOpen, userId]);

  const fetchUserProfile = async () => {
    setLoading(true);
    setUser(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/user/${userId}`);
      if (response.data) {
        setUser(response.data);
      } else {
      }
    } catch (err) {
      if (err.response?.status === 404) {
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const isOwnProfile = userId === currentUserId;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", duration: 0.3 }}
          className="bg-white dark:bg-brand-grey-medium rounded-2xl w-full max-w-md shadow-2xl border border-neutral-200 dark:border-brand-grey-light relative overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Decorative gradient background */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-brand-yellow/20 via-brand-yellow/10 to-transparent dark:from-brand-yellow-light/20 dark:via-brand-yellow-light/10" />
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 dark:bg-brand-grey-dark/80 backdrop-blur-sm hover:bg-white dark:hover:bg-brand-grey-dark text-neutral-600 dark:text-neutral-400 hover:text-brand-grey-dark dark:hover:text-brand-white transition-all duration-200 shadow-sm"
          >
            <FaTimes />
          </button>

          <div className="relative pt-8 pb-6 px-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 border-4 border-brand-yellow border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-neutral-600 dark:text-neutral-400 font-['Inter']">Loading profile...</p>
              </div>
            ) : user ? (
              <>
                {/* Avatar */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring" }}
                  className="flex justify-center mb-6"
                >
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full border-4 border-white dark:border-brand-grey-medium shadow-xl">
                      {user.profile_picture ? (
                        <img
                          src={user.profile_picture}
                          alt={user.given_name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-brand-yellow flex items-center justify-center text-3xl font-bold text-brand-grey-dark">
                          {user.given_name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                      )}
                    </div>
                    {isOwnProfile && (
                      <div className="absolute bottom-0 right-0 w-6 h-6 bg-brand-yellow rounded-full border-2 border-white dark:border-brand-grey-medium flex items-center justify-center">
                        <span className="text-xs text-brand-grey-dark font-bold">You</span>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* User Info */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-center mb-6"
                >
                  <h2 className="text-2xl font-bold text-brand-grey-dark dark:text-brand-white font-['Montserrat'] mb-2">
                    {user.given_name}
                  </h2>
                  {user.preferred_lang && (
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 font-['Inter'] mb-4">
                      Preferred Language: {user.preferred_lang.toUpperCase()}
                    </p>
                  )}
                </motion.div>

                {/* Details */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-3"
                >
                  {user.email && (
                    <div className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-brand-grey-dark rounded-xl">
                      <FaEnvelope className="text-brand-yellow text-lg flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 font-['Inter'] mb-1">Email</p>
                        <p className="text-sm text-brand-grey-dark dark:text-brand-white font-['Inter'] truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  )}

                  {user.created_at && (
                    <div className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-brand-grey-dark rounded-xl">
                      <FaCalendarAlt className="text-brand-yellow text-lg flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 font-['Inter'] mb-1">Member since</p>
                        <p className="text-sm text-brand-grey-dark dark:text-brand-white font-['Inter']">
                          {new Date(user.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-neutral-600 dark:text-neutral-400 font-['Inter']">User not found</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default UserProfileModal;

