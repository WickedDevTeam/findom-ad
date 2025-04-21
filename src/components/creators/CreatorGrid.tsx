
import React from "react";
import CreatorCard from "./CreatorCard";
import { Creator } from "@/types";
import { motion } from "framer-motion";

interface CreatorGridProps {
  creators: Creator[];
  title?: string;
  subtitle?: string;
}

const CreatorGrid = ({ creators, title, subtitle }: CreatorGridProps) => {
  if (creators.length === 0) {
    return null;
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-6">
      {title && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          {subtitle && <p className="text-white/60 mt-1">{subtitle}</p>}
        </div>
      )}

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {creators.map((creator) => (
          <motion.div key={creator.id} variants={item}>
            <CreatorCard creator={creator} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default CreatorGrid;
