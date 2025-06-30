import React from 'react';
import { motion } from 'framer-motion';

const GalleryButton = ({ isOpen, onToggle, title = "Open Project Gallery" }) => {
  return (
    <motion.button
      onClick={onToggle}
      className="fixed bottom-6 right-6 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg border border-gray-200 dark:border-gray-600 hover:shadow-xl transition-shadow"
      style={{ zIndex: 9999 }}
      title={title}
      whileHover={{ 
        scale: 1.1,
        rotate: 5
      }}
      whileTap={{ 
        scale: 0.95 
      }}
      animate={{
        rotate: isOpen ? 45 : 0
      }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20 
      }}
    >
      <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </motion.button>
  );
};

export default GalleryButton; 