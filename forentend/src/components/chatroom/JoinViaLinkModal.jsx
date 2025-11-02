import React, { useState } from "react";
import { FaLink, FaTimes, FaSpinner } from "react-icons/fa";
import { motion } from "framer-motion";

const JoinViaLinkModal = ({ isOpen, onClose, onJoin }) => {
  const [inviteLink, setInviteLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const extractChatId = (link) => {
    if (!link || !link.trim()) {
      return null;
    }

    // Remove whitespace
    const trimmedLink = link.trim();

    // Try to extract UUID from URL
    // Patterns: /Chat/{uuid}, /Chat/{uuid}, Chat/{uuid}, or just the UUID
    const uuidPattern = /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i;
    const match = trimmedLink.match(uuidPattern);
    
    if (match) {
      return match[1];
    }

    // If no UUID found, try to get the last part of URL path
    try {
      const url = new URL(trimmedLink.startsWith('http') ? trimmedLink : `http://${trimmedLink}`);
      const pathParts = url.pathname.split('/').filter(p => p);
      if (pathParts.length > 0) {
        const lastPart = pathParts[pathParts.length - 1];
        // Check if it looks like a UUID
        if (uuidPattern.test(lastPart)) {
          return lastPart;
        }
        return lastPart; // Return even if not UUID format, let backend validate
      }
    } catch (e) {
      // Not a valid URL, might just be the ID
      return trimmedLink;
    }

    return trimmedLink;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!inviteLink.trim()) {
      setError("Please enter an invite link");
      return;
    }

    setIsSubmitting(true);

    try {
      const chatId = extractChatId(inviteLink);
      
      if (!chatId) {
        setError("Invalid invite link format. Please check the link and try again.");
        setIsSubmitting(false);
        return;
      }

      await onJoin(chatId);
      setInviteLink("");
      setError("");
    } catch (err) {
      setError(err.message || "Failed to join chatroom. Please check the link and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && !isSubmitting && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-brand-grey-medium rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-neutral-200 dark:border-brand-grey-light"
      >
        <div className="p-4 border-b border-neutral-200 dark:border-brand-grey-light bg-white dark:bg-brand-grey-medium flex items-center justify-between">
          <h2 className="font-['Montserrat'] font-bold text-[1.35rem] flex items-center text-brand-grey-dark dark:text-brand-white">
            <FaLink className="mr-2 text-brand-yellow dark:text-brand-yellow-light" />
            Join via Invite Link
          </h2>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors disabled:opacity-50"
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 bg-neutral-50 dark:bg-brand-grey-dark">
          <div className="mb-4">
            <label className="font-['Inter'] text-brand-grey-dark dark:text-brand-white block text-sm font-semibold mb-2">
              Paste Invite Link
            </label>
            <input
              type="text"
              value={inviteLink}
              onChange={(e) => {
                setInviteLink(e.target.value);
                setError("");
              }}
              placeholder="https://example.com/Chat/chatroom-id or chatroom-id"
              className="font-['Inter'] placeholder-neutral-400 dark:placeholder-neutral-500 border border-neutral-200 dark:border-brand-grey-light rounded-xl w-full py-3 px-4 bg-white dark:bg-brand-grey-light text-brand-grey-dark dark:text-brand-white leading-tight focus:outline-none focus:ring-2 focus:ring-brand-yellow dark:focus:ring-brand-yellow-light transition-colors disabled:opacity-50"
              disabled={isSubmitting}
              required
            />
            {error && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 font-['Inter']">
                {error}
              </p>
            )}
            <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400 font-['Inter']">
              You can paste the full invite link or just the chatroom ID
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="font-['Montserrat'] font-semibold px-4 py-2 border border-neutral-200 dark:border-brand-grey-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-yellow dark:focus:ring-brand-yellow-light text-brand-grey-dark dark:text-brand-white bg-white dark:bg-brand-grey-medium hover:bg-neutral-50 dark:hover:bg-brand-grey-light disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !inviteLink.trim()}
              className="font-['Montserrat'] font-semibold px-4 py-2 bg-brand-yellow dark:bg-brand-yellow-light hover:bg-brand-yellow-light dark:hover:bg-brand-yellow text-brand-grey-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-yellow dark:focus:ring-brand-yellow-light disabled:opacity-50 transition-colors shadow-sm flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Joining...
                </>
              ) : (
                "Join Room"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default JoinViaLinkModal;

