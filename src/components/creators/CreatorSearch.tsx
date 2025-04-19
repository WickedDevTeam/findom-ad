
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface CreatorSearchProps {
  onSearch: (query: string) => void;
  onFilterChange: (filter: string) => void;
  selectedFilter: string;
}

const filters = ['All', 'Findom', 'Catfish', 'AI Bots', 'Celebrities'];

const CreatorSearch = ({ onSearch, onFilterChange, selectedFilter }: CreatorSearchProps) => {
  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-white/50" />
        <Input
          type="search"
          placeholder="Search creators..."
          className="pl-10 bg-black/20 border-white/10"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Badge
            key={filter}
            variant={selectedFilter === filter ? 'default' : 'outline'}
            className="cursor-pointer hover:bg-white/10"
            onClick={() => onFilterChange(filter)}
          >
            {filter}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default CreatorSearch;
