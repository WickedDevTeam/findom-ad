
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsData } from '@/types/admin';
import { Users, Eye, DollarSign, BarChart } from 'lucide-react';
import { LineChart, BarChart as Chart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

interface DashboardProps {
  statsData: StatsData[];
  activeCreatorsCount: number;
  isLoading?: boolean;
}

const Dashboard = ({ statsData, activeCreatorsCount, isLoading = false }: DashboardProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-black/30 backdrop-blur-sm border border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-findom-purple" />
              Active Listings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24 bg-white/10" />
            ) : (
              <>
                <div className="text-3xl font-bold">{activeCreatorsCount}</div>
                <p className="text-xs text-white/70">
                  {activeCreatorsCount > 0 ? '+12% from last month' : 'No active listings'}
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card className="bg-black/30 backdrop-blur-sm border border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium flex items-center gap-2">
              <Eye className="h-4 w-4 text-findom-green" />
              Monthly Visitors
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24 bg-white/10" />
            ) : (
              <>
                <div className="text-3xl font-bold">3,246</div>
                <p className="text-xs text-white/70">+24% from last month</p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card className="bg-black/30 backdrop-blur-sm border border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-findom-orange" />
              Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24 bg-white/10" />
            ) : (
              <>
                <div className="text-3xl font-bold">$820</div>
                <p className="text-xs text-white/70">+32% from last month</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="bg-black/30 backdrop-blur-sm border border-white/10">
          <CardHeader>
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <BarChart className="h-5 w-5 text-findom-purple" />
              Listings Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {isLoading ? (
                <div className="h-full w-full flex items-center justify-center">
                  <Skeleton className="h-64 w-full bg-white/10" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={statsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="name" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        color: 'white'
                      }} 
                    />
                    <Legend />
                    <Line type="monotone" dataKey="listings" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="visitors" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-black/30 backdrop-blur-sm border border-white/10">
          <CardHeader>
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-findom-orange" />
              Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {isLoading ? (
                <div className="h-full w-full flex items-center justify-center">
                  <Skeleton className="h-64 w-full bg-white/10" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <Chart data={statsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="name" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        color: 'white'
                      }} 
                    />
                    <Legend />
                    <Bar dataKey="revenue" fill="#8884d8" />
                  </Chart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
