// ResetLikeButton.js
import React, { useEffect } from "react";

const ResetLikeButton = () => {
  useEffect(() => {
    const clearLikeCounts = () => {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("likes-")) {
          localStorage.removeItem(key);
        }
      });
      console.log("All like counts have been reset!");
    };

    // Attach the function globally
    window.clearLikeCounts = clearLikeCounts;

    // Cleanup when component unmounts
    return () => {
      delete window.clearLikeCounts;
    };
  }, []);

  return null; // No UI needed
};

export default ResetLikeButton;
