import React from "react";
import { FaHourglassHalf } from "react-icons/fa";

const WaitingApproval = ({ chatName }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-neutral-50 dark:bg-brand-grey-dark mt-20 transition-colors">
      <div className="text-center p-8 max-w-md">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 border-4 border-brand-yellow/30 dark:border-brand-yellow-light/30 rounded-full flex items-center justify-center bg-brand-yellow/10 dark:bg-brand-yellow-light/10">
            <FaHourglassHalf size={32} className="text-brand-yellow dark:text-brand-yellow-light animate-pulse" />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-2 font-['Montserrat'] text-brand-grey-dark dark:text-brand-white">
          Waiting for Approval
        </h2>
        <p className="text-neutral-700 dark:text-neutral-300 mb-6 font-['Inter']">
          Your request to join <strong className="text-brand-grey-dark dark:text-brand-white">"{chatName}"</strong> has been submitted.
          You'll be able to view messages once an admin approves your request.
        </p>
        <div className="flex justify-center">
          <div className="flex space-x-2 mt-4">
            <div
              className="h-3 w-3 bg-brand-yellow dark:bg-brand-yellow-light rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="h-3 w-3 bg-brand-yellow dark:bg-brand-yellow-light rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></div>
            <div
              className="h-3 w-3 bg-brand-yellow dark:bg-brand-yellow-light rounded-full animate-bounce"
              style={{ animationDelay: "600ms" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingApproval;
