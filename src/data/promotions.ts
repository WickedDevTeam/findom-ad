
import { PromotionPackage } from '@/types';

export const promotionPackages: PromotionPackage[] = [
  {
    id: '1',
    title: 'Primary Sponsor',
    description: 'Stand out as the Primary Sponsor with our sponsor card displayed prominently across the entire website on homepage, category or tools pages and blog index page - your brand will be visible to every visitor who visits Findom.ad.',
    price: 49.99,
    duration: 'month',
    limited: true,
    remaining: 1
  },
  {
    id: '2',
    title: 'Featured Listings',
    description: 'Position your tool at the top of the homepage and category pages, ensuring it stands out from the competition. Featured Listings put your tool in front of users the moment they land on Findom.ad, helping drive immediate attention and clicks.',
    price: 29.99,
    duration: 'month',
    limited: true,
    remaining: 3
  }
];
