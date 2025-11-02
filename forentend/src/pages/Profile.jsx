import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCamera, FaLinkedin, FaGithub, FaTwitter, FaGlobe, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: user?.given_name || '',
    username: user?.email?.split('@')[0] || '',
    bio: user?.bio || '',
    status: user?.status || 'Available',
    linkedin: user?.linkedin || '',
    github: user?.github || '',
    twitter: user?.twitter || '',
    website: user?.website || '',
  });
  
  const [profileImage, setProfileImage] = useState(user?.profile_picture || null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [charCount, setCharCount] = useState(profileData.bio.length);
  const maxBioLength = 200;

  useEffect(() => {
    if (user) {
      setProfileData({
        displayName: user.given_name || '',
        username: user.email?.split('@')[0] || '',
        bio: user.bio || '',
        status: user.status || 'Available',
        linkedin: user.linkedin || '',
        github: user.github || '',
        twitter: user.twitter || '',
        website: user.website || '',
      });
      setProfileImage(user.profile_picture);
    }
  }, [user]);

  const handleImageUpload = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    handleImageUpload(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleImageUpload(file);
  };

  const handleInputChange = (field, value) => {
    if (field === 'bio') {
      if (value.length <= maxBioLength) {
        setProfileData({ ...profileData, [field]: value });
        setCharCount(value.length);
      }
    } else {
      setProfileData({ ...profileData, [field]: value });
    }
  };

  const handleSave = async () => {
    const updatedData = {
      given_name: profileData.displayName,
      bio: profileData.bio,
      status: profileData.status,
      linkedin: profileData.linkedin,
      github: profileData.github,
      twitter: profileData.twitter,
      website: profileData.website,
      profile_picture: profileImage,
    };
    
    if (updateUser) {
      const result = await updateUser(updatedData);
      if (result.success) {
        setIsEditing(false);
        setImagePreview(null);
        toast.success('Profile updated successfully!');
      } else {
        toast.error('Failed to save profile changes. Please try again.');
      }
    } else {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setProfileData({
      displayName: user?.given_name || '',
      username: user?.email?.split('@')[0] || '',
      bio: user?.bio || '',
      status: user?.status || 'Available',
      linkedin: user?.linkedin || '',
      github: user?.github || '',
      twitter: user?.twitter || '',
      website: user?.website || '',
    });
    setProfileImage(user?.profile_picture);
    setImagePreview(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-neutral-100 dark:from-neutral-950 dark:via-primary-950/20 dark:to-neutral-900 transition-all duration-500">
      <div className="section-container py-8">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 px-4 py-2 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md text-primary-600 dark:text-primary-400 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-all duration-300 shadow-sm hover:shadow-md group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="font-semibold">Back</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-4xl mx-auto"
        >
          <motion.div
            whileHover={{ scale: 1.01, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-xl rounded-3xl shadow-large p-8 border border-neutral-200/50 dark:border-neutral-700/50 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary-500/10 to-secondary-500/10 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-accent-500/10 to-primary-500/10 rounded-full blur-3xl -z-10" />

            <div className="flex justify-between items-start mb-8">
              <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-50">
                My Profile
              </h1>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(!isEditing)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-2 ${
                  isEditing
                    ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                }`}
              >
                {isEditing ? (
                  <>
                    <FaTimes /> Cancel
                  </>
                ) : (
                  <>
                    <FaEdit /> Edit Profile
                  </>
                )}
              </motion.button>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <div className="sticky top-8">
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative group ${isEditing ? 'cursor-pointer' : ''}`}
                  >
                    <motion.div
                      whileHover={isEditing ? { scale: 1.05 } : {}}
                      className="relative w-48 h-48 mx-auto"
                    >
                      <img
                        src={imagePreview || profileImage || 'https://via.placeholder.com/200x200.png'}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover border-4 border-primary-500/50 shadow-large"
                      />
                      {isEditing && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className={`absolute inset-0 rounded-full flex items-center justify-center bg-black/50 transition-all duration-300 ${
                            isDragging ? 'bg-primary-600/70' : 'group-hover:bg-black/60'
                          }`}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <FaCamera className="text-white text-3xl" />
                        </motion.div>
                      )}
                    </motion.div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>
                  {isEditing && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center text-sm text-neutral-500 dark:text-neutral-400 mt-4"
                    >
                      Click or drag & drop to upload
                    </motion.p>
                  )}

                  <div className="mt-6 space-y-3">
                    <div className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-50 dark:bg-primary-900/30 rounded-xl">
                      <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse" />
                      <span className="text-sm font-semibold text-primary-700 dark:text-primary-300">
                        {isEditing ? (
                          <input
                            type="text"
                            value={profileData.status}
                            onChange={(e) => handleInputChange('status', e.target.value)}
                            className="bg-transparent border-b border-primary-400 outline-none w-full text-center"
                          />
                        ) : (
                          profileData.status
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                    Display Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.displayName}
                      onChange={(e) => handleInputChange('displayName', e.target.value)}
                      className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-200 text-neutral-900 dark:text-neutral-100"
                    />
                  ) : (
                    <p className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                      {profileData.displayName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                    Username
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-200 text-neutral-900 dark:text-neutral-100"
                    />
                  ) : (
                    <p className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                      @{profileData.username}
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                      Bio
                    </label>
                    {isEditing && (
                      <span className={`text-sm ${charCount > maxBioLength * 0.9 ? 'text-error-500' : 'text-neutral-500 dark:text-neutral-400'}`}>
                        {charCount}/{maxBioLength}
                      </span>
                    )}
                  </div>
                  {isEditing ? (
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      rows="4"
                      className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-200 resize-none text-neutral-900 dark:text-neutral-100"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                      {profileData.bio || 'No bio added yet.'}
                    </p>
                  )}
                </div>

                <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6">
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                    Social Links
                  </h3>
                  <div className="space-y-4">
                    {[
                      { icon: FaLinkedin, field: 'linkedin', label: 'LinkedIn', color: 'text-blue-600' },
                      { icon: FaGithub, field: 'github', label: 'GitHub', color: 'text-neutral-800 dark:text-neutral-200' },
                      { icon: FaTwitter, field: 'twitter', label: 'Twitter', color: 'text-sky-500' },
                      { icon: FaGlobe, field: 'website', label: 'Website', color: 'text-primary-600' },
                    ].map(({ icon: Icon, field, label, color }) => (
                      <div key={field} className="flex items-center gap-3">
                        <Icon className={`text-xl ${color}`} />
                        {isEditing ? (
                          <input
                            type="text"
                            value={profileData[field]}
                            onChange={(e) => handleInputChange(field, e.target.value)}
                            placeholder={`Your ${label} URL`}
                            className="flex-1 px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-200 text-neutral-900 dark:text-neutral-100"
                          />
                        ) : (
                          <span className="text-neutral-700 dark:text-neutral-300">
                            {profileData[field] || `No ${label} added`}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {isEditing && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4 pt-4"
                  >
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSave}
                      className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                    >
                      <FaSave /> Save Changes
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCancel}
                      className="px-6 py-3 bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-xl font-semibold hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-all duration-300 shadow-sm"
                    >
                      Cancel
                    </motion.button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
