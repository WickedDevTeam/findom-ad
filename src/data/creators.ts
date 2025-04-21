
import { Creator } from '@/types';

export const creators: Creator[] = [
  {
    id: '1',
    name: 'Billie Eillish',
    username: 'billie-eillish',
    profileImage: 'https://images.unsplash.com/photo-1516920061176-591c5f0b21e8?auto=format&fit=facearea&w=400&h=400', // Stock close-up of a woman
    bio: 'Call me daddy and beg hurt you. Boot lickers and pay pigs to the front. Send me your money and worship my ScamAss.',
    socialLinks: {
      twitter: 'https://twitter.com/',
      throne: 'https://throne.com/',
      cashapp: 'https://cash.app/',
      onlyfans: 'https://onlyfans.com/'
    },
    isVerified: true,
    isFeatured: true,
    isNew: false,
    type: 'Catfish',
    categories: ['Catfish', 'Twitter'],
    gallery: [
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
      'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
      'https://images.unsplash.com/photo-1582562124811-c09040d0a901'
    ],
    createdAt: '2023-09-15T00:00:00.000Z'
  },
  {
    id: '2',
    name: 'Brett Cooper',
    username: 'brett-cooper',
    profileImage: '/lovable-uploads/8b755bea-293b-44a6-b15c-95217133be28.png',
    bio: 'beta boy breaker ♡ pretty catfish dom ♡ May ruin your life and bank account 💕',
    socialLinks: {
      twitter: 'https://twitter.com/',
      cashapp: 'https://cash.app/'
    },
    isVerified: false,
    isFeatured: false,
    isNew: true,
    type: 'Findom',
    categories: ['Catfish', 'Findom', 'Blackmail'],
    gallery: [
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
      'https://images.unsplash.com/photo-1582562124811-c09040d0a901'
    ],
    createdAt: '2024-04-10T00:00:00.000Z'
  },
  {
    id: '3',
    name: 'Selena Gomez',
    username: 'selena-gomez',
    profileImage: 'https://images.unsplash.com/photo-1519648023493-d82b5f8d7d3b?auto=format&fit=facearea&w=400&h=400', // Stock close-up of a woman
    bio: 'Streaming and sync your podcast guest\'s audio in one place, with one click.',
    socialLinks: {
      twitter: 'https://twitter.com/',
      onlyfans: 'https://onlyfans.com/',
      throne: 'https://throne.com/'
    },
    isVerified: true,
    isFeatured: true,
    isNew: false,
    type: 'Celebrity',
    categories: ['Celebrities', 'Catfish', 'Twitter'],
    gallery: [
      'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
      'https://images.unsplash.com/photo-1582562124811-c09040d0a901'
    ],
    createdAt: '2023-11-22T00:00:00.000Z'
  },
  {
    id: '4',
    name: 'AI Girlfriend',
    username: 'ai-girlfriend',
    profileImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    bio: 'Your perfect AI companion. Always available, always understanding. Choose my personality and appearance to match your preferences.',
    socialLinks: {
      twitter: 'https://twitter.com/',
      onlyfans: 'https://onlyfans.com/'
    },
    isVerified: true,
    isFeatured: false,
    isNew: true,
    type: 'AI Bot',
    categories: ['AI Bots', 'Bots'],
    gallery: [
      'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
      'https://images.unsplash.com/photo-1582562124811-c09040d0a901'
    ],
    createdAt: '2024-03-15T00:00:00.000Z'
  },
  {
    id: '5',
    name: 'Money Master',
    username: 'money-master',
    profileImage: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    bio: 'I exist to drain your wallet. Send tributes now or be blocked. Paypigs welcome.',
    socialLinks: {
      cashapp: 'https://cash.app/',
      twitter: 'https://twitter.com/'
    },
    isVerified: true,
    isFeatured: true,
    isNew: false,
    type: 'Findom',
    categories: ['Findom', 'Pay Pigs'],
    gallery: [
      'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
      'https://images.unsplash.com/photo-1582562124811-c09040d0a901'
    ],
    createdAt: '2023-08-10T00:00:00.000Z'
  }
];

export const getCreatorByUsername = (username: string): Creator | undefined => {
  return creators.find(creator => creator.username === username);
};

export const getFeaturedCreators = (): Creator[] => {
  return creators.filter(creator => creator.isFeatured);
};

export const getNewCreators = (): Creator[] => {
  return creators.filter(creator => creator.isNew);
};

export const getCreatorsByCategory = (categorySlug: string): Creator[] => {
  console.log('Searching for category slug:', categorySlug); // Debug log
  
  // Convert slug to display name format
  const categoryMapping: Record<string, string> = {
    'findoms': 'Findom',
    'catfish': 'Catfish',
    'ai-bots': 'AI Bots',
    'celebrities': 'Celebrities',
    'twitter': 'Twitter',
    'blackmail': 'Blackmail',
    'pay-pigs': 'Pay Pigs',
    'bots': 'Bots'
  };
  
  const normalizedCategory = categoryMapping[categorySlug] || 
    categorySlug.split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  
  console.log('Normalized category name:', normalizedCategory); // Debug log
  
  const result = creators.filter(creator => 
    creator.categories.some(c => 
      c.toLowerCase() === normalizedCategory.toLowerCase()
    )
  );
  
  console.log('Found creators:', result.length, result.map(c => c.name)); // Debug log
  return result;
};
