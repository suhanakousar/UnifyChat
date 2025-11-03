import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSmile, FaEdit, FaTrash, FaShare, FaReply, FaCheckDouble } from 'react-icons/fa';

const emojiReactions = ['👍', '❤️', '😂', '😮', '😢', '🔥', '🎉', '👏'];

const MessageActions = ({ 
  message, 
  currentUserId, 
  onReact, 
  onEdit, 
  onDelete, 
  onForward, 
  onReply,
  showReadReceipts 
}) => {
  const [showReactions, setShowReactions] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const isOwnMessage = message?.created_by === currentUserId;

  const handleReaction = (emoji) => {
    if (onReact) {
      onReact(message.id, emoji);
    }
    setShowReactions(false);
    setShowMenu(false);
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowMenu(!showMenu)}
        className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-brand-grey-light text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors opacity-0 group-hover:opacity-100"
        title="Message actions"
      >
        <FaSmile size={14} />
      </motion.button>

      <AnimatePresence>
        {showMenu && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowMenu(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              className="absolute bottom-full mb-2 right-0 bg-white dark:bg-brand-grey-medium rounded-xl shadow-xl border border-neutral-200 dark:border-brand-grey-light z-50 py-2 min-w-[180px]"
            >
              <button
                onClick={() => {
                  setShowReactions(true);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-neutral-50 dark:hover:bg-brand-grey-dark flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300 transition-colors"
              >
                <FaSmile /> Add Reaction
              </button>
              
              {!isOwnMessage && (
                <button
                  onClick={() => {
                    if (onReply) onReply(message);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-neutral-50 dark:hover:bg-brand-grey-dark flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300 transition-colors"
                >
                  <FaReply /> Reply
                </button>
              )}

              {isOwnMessage && (
                <>
                  <button
                    onClick={() => {
                      if (onEdit) onEdit(message);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-neutral-50 dark:hover:bg-brand-grey-dark flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300 transition-colors"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => {
                      if (onDelete) onDelete(message.id);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 text-sm text-red-600 dark:text-red-400 transition-colors"
                  >
                    <FaTrash /> Delete
                  </button>
                </>
              )}

              <button
                onClick={() => {
                  if (onForward) onForward(message);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-neutral-50 dark:hover:bg-brand-grey-dark flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300 transition-colors"
              >
                <FaShare /> Forward
              </button>

              {isOwnMessage && showReadReceipts && (
                <div className="px-4 py-2 border-t border-neutral-200 dark:border-brand-grey-light mt-1">
                  <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                    <FaCheckDouble className="text-brand-yellow" />
                    <span>Read by all</span>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}

        {showReactions && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowReactions(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute bottom-full mb-2 right-0 bg-white dark:bg-brand-grey-medium rounded-xl shadow-xl border border-neutral-200 dark:border-brand-grey-light z-50 p-2"
            >
              <div className="flex gap-2">
                {emojiReactions.map((emoji) => (
                  <motion.button
                    key={emoji}
                    whileHover={{ scale: 1.3 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleReaction(emoji)}
                    className="text-2xl hover:scale-125 transition-transform cursor-pointer"
                  >
                    {emoji}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MessageActions;

