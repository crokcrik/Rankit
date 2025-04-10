"use client";

import { useState, useEffect } from 'react';
import { PlusCircle, Search, ListMusic, Clock, Music2 } from 'lucide-react';
import Link from 'next/link';
import Logo from './components/Logo';

interface Album {
  id: string;
  name: string;
  artist: string;
  imageUrl: string;
}

interface Ranking {
  id: string;
  name: string;
  createdAt: string;
  albums: Album[];
}

interface QuickAction {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  color: string;
}

const quickActions: QuickAction[] = [
  {
    title: 'Search Albums',
    description: 'Find and add new albums to your rankings',
    icon: Search,
    href: '/search',
    color: 'bg-purple-500',
  },
  {
    title: 'Create Ranking',
    description: 'Start a new album ranking list',
    icon: PlusCircle,
    href: '/rankings/new',
    color: 'bg-green-500',
  },
  {
    title: 'Your Rankings',
    description: 'View and edit your saved rankings',
    icon: ListMusic,
    href: '/rankings',
    color: 'bg-blue-500',
  },
];

export default function Home() {
  const [recentRankings, setRecentRankings] = useState<Ranking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRankings();
  }, []);

  const fetchRankings = async () => {
    try {
      const response = await fetch('/api/rankings');
      const data = await response.json();
      // Sort by createdAt date in descending order and take the first 3
      const sortedRankings = data.sort((a: Ranking, b: Ranking) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ).slice(0, 3);
      setRecentRankings(sortedRankings);
    } catch (error) {
      console.error('Error fetching rankings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-background-elevated">
        <div className="relative z-10 mx-auto max-w-4xl min-h-[50vh] flex items-center justify-center py-16 px-6">
          <div className="text-center max-w-2xl">
            <div className="flex justify-center">
              <Logo size="large" />
            </div>
            <p className="mt-8 text-xl text-text-secondary">
              Your music taste, organized and ranked.
              <br />
              Create beautiful album rankings and share them with the world.
            </p>
            <div className="mt-8 flex gap-4 justify-center">
              <Link href="/search" className="btn-primary inline-flex items-center">
                <Search className="w-5 h-5 mr-2" />
                Start Ranking
              </Link>
              <Link href="/rankings" className="btn-secondary inline-flex items-center">
                <Music2 className="w-5 h-5 mr-2" />
                Browse Rankings
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative dots */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 transform">
          <div className="h-48 w-48 opacity-10">
            <div className="absolute h-2 w-2 rounded-full bg-accent"></div>
            <div className="absolute h-2 w-2 rounded-full bg-accent" style={{ top: '2rem' }}></div>
            <div className="absolute h-2 w-2 rounded-full bg-accent" style={{ top: '4rem' }}></div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="px-6 py-12">
        {/* Quick Actions */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-text-primary mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                href={action.href}
                className="album-card hover:scale-[1.02] transition-transform"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${action.color}`}>
                    {action.icon && <action.icon className="w-6 h-6 text-white" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary mb-1">
                      {action.title}
                    </h3>
                    <p className="text-text-secondary text-sm">
                      {action.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Recent Rankings */}
        <section>
          <h2 className="text-2xl font-semibold text-text-primary mb-4">
            Recent Rankings
          </h2>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-accent"></div>
            </div>
          ) : recentRankings.length > 0 ? (
            <div className="space-y-4">
              {recentRankings.map((ranking) => (
                <Link
                  key={ranking.id}
                  href={`/rankings/${ranking.id}`}
                  className="album-card block hover:scale-[1.01] transition-transform"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-text-primary mb-1">
                        {ranking.name}
                      </h3>
                      <div className="flex items-center text-text-secondary text-sm">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>Updated {formatTimeAgo(ranking.createdAt)}</span>
                      </div>
                    </div>
                    <div className="text-text-secondary text-sm">
                      {ranking.albums.length} albums
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-text-secondary mb-4">No rankings yet</p>
              <Link href="/rankings/new" className="btn-primary">
                Create Your First Ranking
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
