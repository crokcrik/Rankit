"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewRankingPage() {
  const [rankingName, setRankingName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/rankings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: rankingName,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create ranking');
      }

      const ranking = await response.json();
      router.push(`/rankings/${ranking.id}`);
    } catch (error) {
      console.error('Error creating ranking:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-text-primary mb-8">Create New Ranking</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="rankingName" className="block text-text-primary mb-2">
            Ranking Name
          </label>
          <input
            type="text"
            id="rankingName"
            value={rankingName}
            onChange={(e) => setRankingName(e.target.value)}
            placeholder="e.g., Best Rock Albums of 2023"
            className="input-field w-full"
            autoFocus
          />
        </div>

        <button
          type="submit"
          className="btn-primary w-full"
          disabled={!rankingName.trim() || isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-black"></div>
            </div>
          ) : (
            'Create Ranking'
          )}
        </button>
      </form>
    </div>
  );
} 