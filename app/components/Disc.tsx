"use client";
import { motion } from 'framer-motion';
import { Player } from '../lib/types';

/**
 * A single Connect 4 disc with spring drop animation.
 * Uses radial gradients for a 3D, premium look.
 */
export default function Disc({ player }: { player: Player }) {
  if (!player) return null;

  const isRed = player === 'RED';

  return (
    <motion.div
      initial={{ y: -200, opacity: 0, scale: 0.8 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22, mass: 0.8 }}
      className={`w-full h-full rounded-full ${
        isRed
          ? 'bg-white shadow-[0_0_20px_rgba(255,255,255,0.3),inset_0_-3px_6px_rgba(0,0,0,0.3)]'
          : 'bg-[#404040] shadow-[0_0_15px_rgba(64,64,64,0.3),inset_0_-3px_6px_rgba(0,0,0,0.4)]'
      }`}
    />
  );
}
