import { useState, useEffect, useRef } from 'react';
import { X, Plus } from 'lucide-react';

interface Ranking {
  id: string;
  name: string;
  albums: Album[];
}

interface Album {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  images: Array<{ url: string }>;
}

interface AddToRankingModalProps {
  isOpen: boolean;
  onClose: () => void;
  album: Album | null;
  onSuccess: (message: string) => void;
}

export default function AddToRankingModal({ isOpen, onClose, album, onSuccess }: AddToRankingModalProps) {
  const [showNewRankingForm, setShowNewRankingForm] = useState(false);
  const [newRankingName, setNewRankingName] = useState('');
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const initialFocusRef = useRef<HTMLInputElement>(null);

  // Focus input when form is shown
  useEffect(() => {
    if (showNewRankingForm && initialFocusRef.current) {
      setTimeout(() => {
        initialFocusRef.current?.focus();
      }, 100);
    }
  }, [showNewRankingForm]);

  const fetchRankings = async () => {
    try {
      const response = await fetch('/api/rankings');
      if (response.ok) {
        const data = await response.json();
        setRankings(data);
      }
    } catch (error) {
      console.error('Error fetching rankings:', error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchRankings();
      setShowNewRankingForm(false);
      setNewRankingName('');
    }
  }, [isOpen]);

  // Handle keyboard escape to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const handleCreateNewRanking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRankingName.trim() || !album) return;
    
    setIsLoading(true);

    try {
      const response = await fetch('/api/rankings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newRankingName,
          album: album,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create ranking');
      }

      const data = await response.json();
      
      // Update the rankings list with the new ranking
      setRankings(prevRankings => [...prevRankings, data]);
      
      // Reset form state
      setNewRankingName('');
      setShowNewRankingForm(false);
      
      // Notify success and close modal
      onSuccess(`Created new ranking "${newRankingName}" with album "${album.name}"`);
      onClose();
    } catch (error) {
      console.error('Error creating ranking:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToExisting = async (rankingId: string, rankingName: string) => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/rankings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rankingId,
          album,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add album to ranking');
      }

      onSuccess(`Added "${album?.name}" to "${rankingName}"`);
      onClose();
    } catch (error) {
      console.error('Error adding album to ranking:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !album) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 md:p-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-background-secondary rounded-lg w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col animate-slide-up shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-text-primary">Add to Ranking</h2>
          <button 
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors rounded-full p-1"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="flex items-center gap-3 mb-6">
            <img 
              src={album.images[0]?.url || '/placeholder-album.png'} 
              alt={album.name} 
              className="w-16 h-16 object-cover rounded shadow-md"
              loading="lazy"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-text-primary truncate">{album.name}</h3>
              <p className="text-text-secondary text-sm truncate">{album.artists[0]?.name}</p>
            </div>
          </div>

          {showNewRankingForm ? (
            <form onSubmit={handleCreateNewRanking} className="mb-4">
              <label className="block text-sm text-text-secondary mb-2">
                Ranking Name
              </label>
              <input 
                ref={initialFocusRef}
                type="text"
                value={newRankingName}
                onChange={(e) => setNewRankingName(e.target.value)}
                placeholder="Enter a name for your new ranking"
                className="input-field mb-4 w-full"
                required
              />
              <div className="flex gap-2">
                <button
                  type="button" 
                  onClick={() => setShowNewRankingForm(false)}
                  className="btn-secondary flex-1"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn-primary flex-1"
                  disabled={isLoading || !newRankingName.trim()}
                >
                  {isLoading ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          ) : (
            <>
              <button 
                onClick={() => setShowNewRankingForm(true)}
                className="btn-primary w-full mb-6 flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create New Ranking
              </button>

              {rankings.length > 0 ? (
                <>
                  <h4 className="text-sm text-text-secondary mb-2">Or add to existing ranking:</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {rankings.map(ranking => (
                      <button
                        key={ranking.id}
                        onClick={() => handleAddToExisting(ranking.id, ranking.name)}
                        disabled={isLoading}
                        className="w-full text-left p-3 rounded-lg bg-background-elevated hover:bg-surface transition-colors flex items-center justify-between active:bg-surface"
                      >
                        <span className="truncate">{ranking.name}</span>
                        <span className="text-xs text-text-secondary">{ranking.albums.length} albums</span>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-center text-text-secondary">No existing rankings found. Create your first one!</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
} 