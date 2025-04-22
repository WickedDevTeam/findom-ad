
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import RootLayout from '@/components/layout/RootLayout';
import { ArrowRight, CheckCircle, Search } from 'lucide-react';

const Index = () => {
  return (
    <RootLayout>
      <div className="container mx-auto py-8">
        <div className="space-y-10">
          {/* Hero Section */}
          <section className="text-center space-y-6 pt-8 pb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-findom-purple to-findom-green bg-clip-text text-transparent">
              Welcome to Findom.ad
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              The premier directory for financial domination enthusiasts. Browse verified profiles, connect with creators, and find your perfect match.
            </p>
            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <Button asChild size="lg" className="bg-findom-purple hover:bg-findom-purple/80">
                <Link to="/findoms">Browse Findoms</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/20">
                <Link to="/create-listing">Create Your Listing</Link>
              </Button>
            </div>
          </section>

          {/* Feature Cards */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-black/30 border border-white/10 shadow-xl">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-full bg-findom-purple/20 flex items-center justify-center mb-2">
                  <CheckCircle className="w-6 h-6 text-findom-purple" />
                </div>
                <CardTitle>Verified Profiles</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/70">
                  All profiles are verified to ensure authenticity and quality experiences.
                </p>
              </CardContent>
              <CardFooter>
                <Link to="/category/verified" className="text-findom-purple hover:underline flex items-center">
                  Browse Verified <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </CardFooter>
            </Card>

            <Card className="bg-black/30 border border-white/10 shadow-xl">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-full bg-findom-green/20 flex items-center justify-center mb-2">
                  <Search className="w-6 h-6 text-findom-green" />
                </div>
                <CardTitle>Advanced Search</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/70">
                  Find exactly what you're looking for with our powerful filtering options.
                </p>
              </CardContent>
              <CardFooter>
                <Link to="/search" className="text-findom-green hover:underline flex items-center">
                  Start Searching <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </CardFooter>
            </Card>

            <Card className="bg-black/30 border border-white/10 shadow-xl">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-2">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" fill="currentColor" />
                    <path d="M13 4.06891C12.6735 4.02346 12.3395 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 11.6605 19.9765 11.3265 19.9311 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M15 4.5V8.5H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M16 7L20 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <CardTitle>Quick Connect</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/70">
                  Connect with creators directly through their verified social links.
                </p>
              </CardContent>
              <CardFooter>
                <Link to="/category/new" className="text-white hover:underline flex items-center">
                  Discover New <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </CardFooter>
            </Card>
          </section>

          {/* Featured Categories */}
          <section className="py-10">
            <h2 className="text-2xl font-bold mb-6">Popular Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'Findoms', emoji: '👑', to: '/findoms' },
                { name: 'Pay Pigs', emoji: '🐷', to: '/pay-pigs' },
                { name: 'Catfish', emoji: '🐟', to: '/catfish' },
                { name: 'AI Bots', emoji: '🤖', to: '/ai-bots' },
                { name: 'Twitter', emoji: '🐦', to: '/twitter' },
                { name: 'Celebrities', emoji: '🌟', to: '/celebrities' },
                { name: 'Blackmail', emoji: '💸', to: '/blackmail' },
                { name: 'Bots', emoji: '⚡️', to: '/bots' }
              ].map((category) => (
                <Link 
                  key={category.name}
                  to={category.to}
                  className="bg-black/20 hover:bg-black/30 border border-white/10 rounded-lg p-4 text-center transition-all hover:scale-105"
                >
                  <div className="text-3xl mb-2">{category.emoji}</div>
                  <div className="font-medium">{category.name}</div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </RootLayout>
  );
};

export default Index;
