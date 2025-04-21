
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Tag } from 'lucide-react';

interface CreatorSearchProps {
  onSearch: (query: string) => void;
  onFilterChange: (filter: string) => void;
  selectedFilter: string;
}

// Map filter names to their appropriate badge variant
const getFilterVariant = (filter: string): string => {
  const filterMap: Record<string, string> = {
    'Findom': 'findom',
    'Catfish': 'catfish',
    'AI Bots': 'aibot',
    'Celebrities': 'celebrity',
    'Twitter': 'twitter',
    'Blackmail': 'blackmail',
    'Pay Pigs': 'paypig',
    'All': 'default'
  };
  
  return filterMap[filter] || 'default';
};

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
            variant={selectedFilter === filter ? getFilterVariant(filter) : 'outline'}
            className={`
              cursor-pointer transition-all duration-200
              ${selectedFilter === filter ? '' : 'hover:bg-black/60'}
            `}
            onClick={() => onFilterChange(filter)}
          >
            {selectedFilter === filter && <Tag size={12} className="mr-1 opacity-80" />}
            {filter}
          </Badge>
        </motion.div>
      ))}
    </div>
  </div>
);

export default CreatorSearch;
