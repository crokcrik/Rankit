"use client";

import { useState } from 'react';
import { Search as SearchIcon, Plus } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { useEffect } from 'react';
import AddToRankingModal from '../components/AddToRankingModal';
import Toast from '../components/Toast';

interface SpotifyAlbum {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  images: Array<{ url: string }>;
  release_date: string;
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [albums, setAlbums] = useState<SpotifyAlbum[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<SpotifyAlbum | null>(null);
  const [toast, setToast] = useState<{ message: string } | null>(null);
  const debouncedSearch = useDebounce(searchQuery, 500);

  useEffect(() => {
    const searchAlbums = async () => {
      if (!debouncedSearch) {
        setAlbums([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(debouncedSearch)}`);
        const data = await response.json();
        setAlbums(data);
      } catch (error) {
        console.error('Error searching albums:', error);
      } finally {
        setIsLoading(false);
      }
    };

    searchAlbums();
  }, [debouncedSearch]);

  const handleSuccess = (message: string) => {
    setToast({ message });
    setSelectedAlbum(null);
  };

  return (
    <div className="p-4 md:p-6">
      {/* Search Bar */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-4">Search Albums</h1>
        <div className="relative w-full max-w-2xl">
          <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
          <input
            type="text"
            placeholder="Search for albums or artists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-12 w-full"
          />
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {isLoading ? (
          <div className="col-span-full text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-accent"></div>
          </div>
        ) : albums.length > 0 ? (
          albums.map((album) => (
            <div key={album.id} className="album-card group">
              <div className="relative aspect-square mb-3 md:mb-4">
                <img
                  src={album.images[0]?.url || '/placeholder-album.png'}
                  alt={`${album.name} cover`}
                  className="w-full h-full object-cover rounded-md"
                  loading="lazy"
                />
                <button 
                  className="btn-primary absolute bottom-2 right-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity p-2 md:p-2"
                  onClick={() => setSelectedAlbum(album)}
                  aria-label="Add to ranking"
                >
                  <Plus className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
              <h3 className="font-semibold text-sm md:text-base text-text-primary truncate">{album.name}</h3>
              <p className="text-xs md:text-sm text-text-secondary truncate">{album.artists[0]?.name}</p>
              <p className="text-xs text-text-secondary mt-1">{new Date(album.release_date).getFullYear()}</p>
            </div>
          ))
        ) : searchQuery ? (
          <div className="col-span-full text-center py-12 text-text-secondary">
            No albums found for "{searchQuery}"
          </div>
        ) : null}
      </div>

      <AddToRankingModal
        isOpen={!!selectedAlbum}
        onClose={() => setSelectedAlbum(null)}
        album={selectedAlbum}
        onSuccess={handleSuccess}
      />

      {toast && (
        <Toast
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
} 