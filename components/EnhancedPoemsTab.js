import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Play, RotateCcw } from 'lucide-react';

// Sidebar: Poem selector and controls
export function EnhancedPoemsTabSidebar({ poems, selectedPoem, setSelectedPoem, isAnimating, startAnimation, resetAnimation }) {
  if (!poems || poems.length === 0) {
    return (
      <div className="text-gray-400 italic text-center py-8">
        <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-60" />
        No poems available for this project.
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Poem Selector */}
      <div className="space-y-2">
        <h3 className="text-white font-semibold text-sm mb-3">Select a Poem</h3>
        <div className="grid gap-2">
          {poems.map((poem, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedPoem(index)}
              className={`text-left p-3 rounded-lg transition-all duration-200 ${
                selectedPoem === index 
                  ? 'bg-blue-900/30 border border-blue-500/50 text-white' 
                  : 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white'
              }`}
            >
              <div className="font-medium text-sm">{poem.Title}</div>
              <div className="text-xs text-gray-400 mt-1">{poem.Author}</div>
              {poem.location && (
                <div className="text-xs text-blue-400 mt-1">{poem.location}</div>
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
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg text-sm transition-colors"
        >
          <Play className="w-4 h-4" />
          {isAnimating ? 'Playing...' : 'Animate'}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetAnimation}
          className="flex items-center gap-2 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors"
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
        className={`leading-relaxed ${
          isActive ? 'text-blue-300' : 
          isComplete ? 'text-gray-200' : 'text-gray-500'
        }`}
      >
        {displayText}
        {isActive && displayText.length < text.length && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
            className="text-blue-400"
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
        <div className="border-l-4 border-blue-500 pl-4 py-2">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-bold text-white mb-1"
          >
            {poem?.Title}
          </motion.h2>
          {poem?.Author && (
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-400 text-sm"
            >
              by {poem.Author}
            </motion.p>
          )}
          {poem?.location && (
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="text-blue-400 text-xs mt-1"
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
          className="bg-gray-900/50 rounded-lg p-6 border border-gray-700/50"
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