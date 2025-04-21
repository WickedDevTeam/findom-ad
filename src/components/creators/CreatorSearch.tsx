import React from 'react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface CreatorSearchProps {
  onSearch: (query: string) => void;
  onFilterChange: (filter: string) => void;
  selectedFilter: string;
}

const filters = ['All', 'Findom', 'Catfish', 'AI Bots', 'Celebrities', 'Twitter', 'Blackmail', 'Pay Pigs'];

const CreatorSearch = ({ onSearch, onFilterChange, selectedFilter }: CreatorSearchProps) => (
  <div className="space-y-6 animate-fade-in">
    <div className="flex flex-wrap gap-2">
      {filters.map((filter, index) => (
        <motion.div
          key={filter}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <Badge
            variant={selectedFilter === filter ? 'default' : 'outline'}
            className={`
              cursor-pointer transition-all duration-200
              ${selectedFilter === filter 
                ? 'bg-findom-purple hover:bg-findom-purple/90' 
                : 'hover:bg-white/10'
              }
            `}
            onClick={() => onFilterChange(filter)}
          >
            {filter}
          </Badge>
        </motion.div>
      ))}
    </div>
  </div>
);

export default CreatorSearch;
