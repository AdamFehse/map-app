import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Play, RotateCcw } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';

// Sidebar: Poem selector and controls
export function EnhancedPoemsTabSidebar({ poems, selectedPoem, setSelectedPoem, isAnimating, startAnimation, resetAnimation }) {
  const { isDarkMode } = useDarkMode();
  
  if (!poems || poems.length === 0) {
    return (
      <div 
        className="italic text-center py-8"
        style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}
      >
        <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-60" />
        No poems available for this project.
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Poem Selector */}
      <div className="space-y-2">
        <h3 
          className="font-semibold text-sm mb-3"
          style={{ color: isDarkMode ? '#ffffff' : '#111827' }}
        >
          Select a Poem
        </h3>
        <div className="grid gap-2">
          {poems.map((poem, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedPoem(index)}
              className="text-left p-3 rounded-lg transition-all duration-200"
              style={{
                backgroundColor: selectedPoem === index 
                  ? (isDarkMode ? 'rgba(30, 58, 138, 0.3)' : 'rgba(59, 130, 246, 0.1)')
                  : (isDarkMode ? 'rgba(31, 41, 55, 0.5)' : 'rgba(243, 244, 246, 0.8)'),
                border: selectedPoem === index 
                  ? (isDarkMode ? '1px solid rgba(59, 130, 246, 0.5)' : '1px solid rgba(59, 130, 246, 0.3)')
                  : '1px solid transparent',
                color: selectedPoem === index 
                  ? (isDarkMode ? '#ffffff' : '#111827')
                  : (isDarkMode ? '#d1d5db' : '#6b7280'),
                '&:hover': {
                  backgroundColor: selectedPoem === index 
                    ? (isDarkMode ? 'rgba(30, 58, 138, 0.3)' : 'rgba(59, 130, 246, 0.1)')
                    : (isDarkMode ? 'rgba(55, 65, 81, 0.5)' : 'rgba(229, 231, 235, 0.8)'),
                  color: selectedPoem === index 
                    ? (isDarkMode ? '#ffffff' : '#111827')
                    : (isDarkMode ? '#ffffff' : '#111827')
                }
              }}
            >
              <div className="font-medium text-sm">{poem.Title}</div>
              <div 
                className="text-xs mt-1"
                style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}
              >
                {poem.Author}
              </div>
              {poem.location && (
                <div 
                  className="text-xs mt-1"
                  style={{ color: '#3b82f6' }}
                >
                  {poem.location}
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>
      {/* Animation Controls */}
      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={startAnimation}
          disabled={isAnimating}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors"
          style={{
            backgroundColor: isAnimating 
              ? (isDarkMode ? '#4b5563' : '#9ca3af')
              : '#3b82f6',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: isAnimating 
                ? (isDarkMode ? '#4b5563' : '#9ca3af')
                : '#2563eb'
            }
          }}
        >
          <Play className="w-4 h-4" />
          {isAnimating ? 'Playing...' : 'Animate'}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetAnimation}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors"
          style={{
            backgroundColor: isDarkMode ? '#4b5563' : '#6b7280',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: isDarkMode ? '#374151' : '#4b5563'
            }
          }}
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </motion.button>
      </div>
    </div>
  );
}

// Main panel: Animated poem display
export function EnhancedPoemsTabDisplay({ poem, completedLines, currentLineIndex }) {
  const { isDarkMode } = useDarkMode();
  
  if (!poem) return null;
  const lines = poem.Content?.split('\n')?.filter(line => line.trim()) || [];
  const TypewriterLine = ({ text, isActive, isComplete, delay = 0 }) => {
    const [displayText, setDisplayText] = React.useState('');
    useEffect(() => {
      if (!isActive) {
        if (isComplete) {
          setDisplayText(text);
        } else {
          setDisplayText('');
        }
        return;
      }
      let index = 0;
      const timer = setInterval(() => {
        setDisplayText(text.slice(0, index + 1));
        index++;
        if (index >= text.length) {
          clearInterval(timer);
        }
      }, 50 + Math.random() * 30);
      return () => clearInterval(timer);
    }, [isActive, text, isComplete]);
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ 
          opacity: isActive || isComplete ? 1 : 0.3,
          y: isActive || isComplete ? 0 : 10 
        }}
        transition={{ duration: 0.5, delay }}
        className="leading-relaxed"
        style={{
          color: isActive 
            ? '#93c5fd' 
            : isComplete 
              ? (isDarkMode ? '#d1d5db' : '#374151')
              : (isDarkMode ? '#6b7280' : '#9ca3af')
        }}
      >
        {displayText}
        {isActive && displayText.length < text.length && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
            style={{ color: '#60a5fa' }}
          >
            |
          </motion.span>
        )}
      </motion.div>
    );
  };
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={poem.Title}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        {/* Poem Header */}
        <div 
          className="border-l-4 pl-4 py-2"
          style={{ borderColor: '#3b82f6' }}
        >
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-bold mb-1"
            style={{ color: isDarkMode ? '#ffffff' : '#111827' }}
          >
            {poem?.Title}
          </motion.h2>
          {poem?.Author && (
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="text-sm"
              style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}
            >
              by {poem.Author}
            </motion.p>
          )}
          {poem?.location && (
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="text-xs mt-1"
              style={{ color: '#3b82f6' }}
            >
              📍 {poem.location}
            </motion.p>
          )}
        </div>
        {/* Poem Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="rounded-lg p-6 border"
          style={{
            backgroundColor: isDarkMode ? 'rgba(17, 24, 39, 0.5)' : 'rgba(249, 250, 251, 0.8)',
            borderColor: isDarkMode ? 'rgba(55, 65, 81, 0.5)' : 'rgba(229, 231, 235, 0.8)'
          }}
        >
          <div className="space-y-3 text-base font-mono">
            {lines.map((line, index) => (
              <TypewriterLine
                key={`${poem.Title}-${index}`}
                text={line}
                isActive={currentLineIndex === index}
                isComplete={completedLines.includes(index)}
                delay={index * 0.1}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 