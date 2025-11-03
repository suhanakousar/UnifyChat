import React, { useState, useMemo } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const MessageSearch = ({ messages, onSelectMessage, isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMessages = useMemo(() => {
    if (!searchTerm.trim()) return [];
    
    const term = searchTerm.toLowerCase();
    return messages.filter(
      (msg) =>
        msg.content?.toLowerCase().includes(term) ||
        msg.sender?.given_name?.toLowerCase().includes(term)
    );
  }, [messages, searchTerm]);

  const handleSelect = (message) => {
    onSelectMessage(message);
    setSearchTerm('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="absolute top-0 left-0 right-0 z-50 bg-white dark:bg-brand-grey-medium border-b border-neutral-200 dark:border-brand-grey-light shadow-lg"
      >
        <div className="p-4 flex items-center gap-3">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-neutral-200 dark:border-brand-grey-light rounded-lg bg-neutral-50 dark:bg-brand-grey-dark text-brand-grey-dark dark:text-brand-white focus:outline-none focus:ring-2 focus:ring-brand-yellow font-['Inter']"
              autoFocus
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
              >
                <FaTimes />
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-brand-grey-light rounded-lg transition-colors font-['Inter']"
          >
            Cancel
          </button>
        </div>

        {searchTerm && (
          <div className="max-h-64 overflow-y-auto border-t border-neutral-200 dark:border-brand-grey-light">
            {filteredMessages.length > 0 ? (
              <div className="p-2">
                <p className="px-3 py-2 text-xs text-neutral-500 dark:text-neutral-400 font-['Inter']">
                  {filteredMessages.length} result{filteredMessages.length !== 1 ? 's' : ''}
                </p>
                {filteredMessages.map((message) => (
                  <motion.div
                    key={message.id}
                    whileHover={{ backgroundColor: 'rgba(249, 237, 50, 0.1)' }}
                    onClick={() => handleSelect(message)}
                    className="px-3 py-2 cursor-pointer rounded-lg hover:bg-brand-yellow/10 dark:hover:bg-brand-yellow/20 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-brand-grey-dark dark:text-brand-white font-['Inter']">
                        {message.sender?.given_name}
                      </span>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400 font-['Inter']">
                        {new Date(message.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-700 dark:text-neutral-300 font-['Inter'] line-clamp-2">
                      {message.content}
                    </p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-neutral-500 dark:text-neutral-400 font-['Inter']">
                  No messages found
                </p>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default MessageSearch;

