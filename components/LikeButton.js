import React, { useState, useEffect } from "react";

export default function LikeButton({ projectId }) {
  const [likeCount, setLikeCount] = useState(0);

  // Load the like count from localStorage
  useEffect(() => {
    if (!projectId) return; // Avoid running if projectId is undefined
    const storedLikes = localStorage.getItem(`likes-${projectId}`);
    const parsedLikes = storedLikes ? parseInt(storedLikes, 10) : 0;

    console.log(`Loaded Like Count for ${projectId}: ${parsedLikes}`);
    setLikeCount(parsedLikes); // Ensure the state is updated only once
  }, [projectId]); // Only re-run if projectId changes

  // Save the like count to localStorage
  const saveLikes = (newCount) => {
    localStorage.setItem(`likes-${projectId}`, newCount);
    console.log(`Saving ${newCount} for likes-${projectId}`);
  };

  // Increment the like count
  const handleLike = () => {
    const newCount = likeCount + 1;
    setLikeCount(newCount);
    saveLikes(newCount);
  };

  return (
    <button onClick={handleLike} style={{ marginTop: "10px" }}>
      👍 {likeCount} Likes
    </button>
  );
}
