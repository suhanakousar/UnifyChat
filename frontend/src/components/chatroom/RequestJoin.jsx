import React, { useState } from "react";
import { FaUserPlus, FaTimes } from "react-icons/fa";

const RequestJoin = ({ chatName, onJoinRequest, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      // Simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onJoinRequest();
    } catch (error) {
      console.error("Error sending join request:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-brand-grey-medium rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-neutral-200 dark:border-brand-grey-light">
        <div className="p-4 border-b border-neutral-200 dark:border-brand-grey-light bg-white dark:bg-brand-grey-medium flex items-center justify-between">
          <h2 className="font-['Montserrat'] font-bold text-[1.35rem] flex items-center text-brand-grey-dark dark:text-brand-white">
            <FaUserPlus className="mr-2 text-brand-yellow dark:text-brand-yellow-light" />
            Join Chat Room
          </h2>
          <button
            onClick={onCancel}
            className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>

        <div className="p-6 bg-neutral-50 dark:bg-brand-grey-dark">
          <div className="mb-6">
            <p className="font-['Inter'] text-brand-grey-dark dark:text-brand-white">
              You've been invited to join <strong className="text-brand-grey-dark dark:text-brand-white">"{chatName}"</strong>. Your
              request will be reviewed by the group admin.
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="font-['Montserrat'] font-semibold px-4 py-2 border border-neutral-200 dark:border-brand-grey-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-yellow dark:focus:ring-brand-yellow-light text-brand-grey-dark dark:text-brand-white bg-white dark:bg-brand-grey-medium hover:bg-neutral-50 dark:hover:bg-brand-grey-light disabled:opacity-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="font-['Montserrat'] font-semibold px-4 py-2 bg-brand-yellow dark:bg-brand-yellow-light hover:bg-brand-yellow-light dark:hover:bg-brand-yellow text-brand-grey-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-yellow dark:focus:ring-brand-yellow-light disabled:opacity-50 transition-colors shadow-sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Requesting..." : "Request to Join"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestJoin;
