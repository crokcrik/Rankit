"use client";

import { useState, useEffect } from 'react';
import { Clock, MoreVertical, Edit2, Image, Trash2, X } from 'lucide-react';
import Link from 'next/link';

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

export default function RankingsPage() {
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [editingRanking, setEditingRanking] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [selectingCover, setSelectingCover] = useState<string | null>(null);

  useEffect(() => {
    fetchRankings();
  }, []);

  const fetchRankings = async () => {
    try {
      const response = await fetch('/api/rankings');
      const data = await response.json();
      setRankings(data);
    } catch (error) {
      console.error('Error fetching rankings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (rankingId: string) => {
    if (!confirm('Are you sure you want to delete this ranking?')) return;

    try {
      const response = await fetch(`/api/rankings/${rankingId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setRankings(rankings.filter(r => r.id !== rankingId));
      } else {
        throw new Error('Failed to delete ranking');
      }
    } catch (error) {
      console.error('Error deleting ranking:', error);
    }
  };

  const handleRename = async (rankingId: string) => {
    if (!newName.trim()) return;

    try {
      const response = await fetch(`/api/rankings/${rankingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newName }),
      });

      if (response.ok) {
        const updatedRanking = await response.json();
        setRankings(rankings.map(r => 
          r.id === rankingId ? { ...r, name: updatedRanking.name } : r
        ));
        setEditingRanking(null);
        setNewName('');
      } else {
        throw new Error('Failed to rename ranking');
      }
    } catch (error) {
      console.error('Error renaming ranking:', error);
    }
  };

  const handleSetCover = async (rankingId: string, albumId: string) => {
    try {
      const response = await fetch(`/api/rankings/${rankingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ coverAlbumId: albumId }),
      });

      if (response.ok) {
        const updatedRanking = await response.json();
        setRankings(rankings.map(r => 
          r.id === rankingId ? updatedRanking : r
        ));
        setSelectingCover(null);
      } else {
        throw new Error('Failed to update cover');
      }
    } catch (error) {
      console.error('Error updating cover:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-text-primary">Your Rankings</h1>
        <Link href="/search" className="btn-primary">
          Add New Ranking
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-accent"></div>
        </div>
      ) : rankings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {rankings.map((ranking) => (
            <div key={ranking.id} className="album-card group relative">
              <Link href={`/rankings/${ranking.id}`}>
                <div className="relative aspect-square mb-4">
                  <img
                    src={ranking.albums[0]?.imageUrl || '/placeholder-album.jpg'}
                    alt={`${ranking.name} cover`}
                    className="w-full h-full object-cover rounded-md"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
                    <span className="btn-primary">
                      Open Ranking
                    </span>
                  </div>
                </div>
              </Link>

              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  {editingRanking === ranking.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="input-field text-sm flex-1"
                        placeholder={ranking.name}
                        autoFocus
                      />
                      <button
                        onClick={() => handleRename(ranking.id)}
                        className="btn-primary p-1"
                        disabled={!newName.trim()}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingRanking(null);
                          setNewName('');
                        }}
                        className="text-text-secondary hover:text-text-primary p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <h3 className="font-semibold text-text-primary truncate mb-1">
                      {ranking.name}
                    </h3>
                  )}
                  <div className="flex items-center text-text-secondary text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>Created {new Date(ranking.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-text-secondary text-sm mt-1">
                    {ranking.albums.length} albums
                  </p>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setActiveMenu(activeMenu === ranking.id ? null : ranking.id)}
                    className="text-text-secondary hover:text-text-primary p-1"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  {activeMenu === ranking.id && (
                    <div className="absolute right-0 mt-1 w-48 bg-background-elevated rounded-lg shadow-lg py-1 z-10">
                      <button
                        onClick={() => {
                          setEditingRanking(ranking.id);
                          setNewName(ranking.name);
                          setActiveMenu(null);
                        }}
                        className="w-full px-4 py-2 text-left text-text-primary hover:bg-background-secondary flex items-center gap-2"
                      >
                        <Edit2 className="w-4 h-4" />
                        Rename
                      </button>
                      {ranking.albums.length > 0 && (
                        <button
                          onClick={() => {
                            setSelectingCover(ranking.id);
                            setActiveMenu(null);
                          }}
                          className="w-full px-4 py-2 text-left text-text-primary hover:bg-background-secondary flex items-center gap-2"
                        >
                          <Image className="w-4 h-4" />
                          Change Cover
                        </button>
                      )}
                      <button
                        onClick={() => {
                          handleDelete(ranking.id);
                          setActiveMenu(null);
                        }}
                        className="w-full px-4 py-2 text-left text-red-500 hover:bg-background-secondary flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {selectingCover === ranking.id && ranking.albums.length > 0 && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-background-elevated rounded-lg p-6 max-w-2xl w-full mx-4">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold text-text-primary">Select Cover Album</h2>
                      <button
                        onClick={() => setSelectingCover(null)}
                        className="text-text-secondary hover:text-text-primary"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
                      {ranking.albums.map((album) => (
                        <button
                          key={album.id}
                          onClick={() => handleSetCover(ranking.id, album.id)}
                          className="aspect-square relative rounded-md overflow-hidden hover:opacity-80 transition-opacity"
                        >
                          <img
                            src={album.imageUrl}
                            alt={album.name}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-text-secondary mb-4">No rankings yet</p>
          <Link href="/search" className="btn-primary">
            Create Your First Ranking
          </Link>
        </div>
      )}
    </div>
  );
} 