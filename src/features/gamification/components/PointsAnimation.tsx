import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PointsAnimationProps {
  points: number;
  message: string;
}

export function PointsAnimation({ points, message }: PointsAnimationProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed bottom-20 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg"
        >
          <p className="font-medium">+{points} points</p>
          <p className="text-sm text-blue-100">{message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}