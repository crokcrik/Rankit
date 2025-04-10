import { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';

interface Ranking {
  id: string;
  name: string;
  albums: Array<{
    id: string;
    name: string;
    artist: string;
    imageUrl: string;
  }>;
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

  useEffect(() => {
    if (isOpen) {
      fetchRankings();
    }
  }, [isOpen]);

  const fetchRankings = async () => {
    try {
      const response = await fetch('/api/rankings');
      const data = await response.json();
      setRankings(data);
    } catch (error) {
      console.error('Error fetching rankings:', error);
    }
  };

  if (!isOpen || !album) return null;

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

  return (
    <>
      {isOpen && album && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background-elevated rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-text-primary">Add to Ranking</h2>
              <button
                onClick={onClose}
                className="text-text-secondary hover:text-text-primary"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-4 p-4 bg-surface rounded-lg">
                <img
                  src={album.images[0]?.url}
                  alt={album.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <h3 className="font-semibold text-text-primary">{album.name}</h3>
                  <p className="text-text-secondary">{album.artists[0]?.name}</p>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-accent"></div>
              </div>
            ) : !showNewRankingForm ? (
              <>
                <div className="space-y-2 mb-4">
                  {rankings.map((ranking) => (
                    <button
                      key={ranking.id}
                      onClick={() => handleAddToExisting(ranking.id, ranking.name)}
                      className="w-full text-left p-4 bg-surface hover:bg-background-elevated rounded-lg transition-colors"
                    >
                      <h3 className="font-semibold text-text-primary">{ranking.name}</h3>
                      <p className="text-text-secondary text-sm">{ranking.albums.length} albums</p>
                    </button>
                  ))}
                  {rankings.length === 0 && (
                    <p className="text-text-secondary text-center py-4">
                      No rankings yet. Create your first one!
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setShowNewRankingForm(true)}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Create New Ranking
                </button>
              </>
            ) : (
              <form onSubmit={handleCreateNewRanking}>
                <input
                  type="text"
                  placeholder="Ranking name"
                  value={newRankingName}
                  onChange={(e) => setNewRankingName(e.target.value)}
                  className="input-field mb-4"
                  autoFocus
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
                    disabled={!newRankingName.trim() || isLoading}
                  >
                    Create
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
} 