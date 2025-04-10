"use client";

import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DroppableProvided, DraggableProvided, DropResult } from '@hello-pangea/dnd';
import { GripVertical, X, Edit2, Save, Plus } from 'lucide-react';
import Link from 'next/link';

interface Album {
  id: string;
  name: string;
  artist: string;
  imageUrl: string;
  rank: number;
}

interface Ranking {
  id: string;
  name: string;
  albums: Album[];
}

export default function RankingDetail({ params }: { params: { id: string } }) {
  const [ranking, setRanking] = useState<Ranking | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [rankingName, setRankingName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRanking();
  }, [params.id]);

  const fetchRanking = async () => {
    try {
      const response = await fetch(`/api/rankings/${params.id}`);
      if (!response.ok) throw new Error('Failed to fetch ranking');
      const data = await response.json();
      setRanking(data);
      setRankingName(data.name);
    } catch (error) {
      console.error('Error fetching ranking:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !ranking) return;

    const items = Array.from(ranking.albums);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update ranks
    const updatedItems = items.map((item, index) => ({
      ...item,
      rank: index + 1
    }));

    setRanking({
      ...ranking,
      albums: updatedItems
    });
  };

  const handleSaveTitle = async () => {
    if (!ranking) return;
    
    try {
      const response = await fetch(`/api/rankings/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: rankingName }),
      });

      if (!response.ok) throw new Error('Failed to update ranking');

      setRanking({
        ...ranking,
        name: rankingName
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating ranking:', error);
    }
  };

  const removeAlbum = async (albumId: string) => {
    if (!ranking) return;

    try {
      const response = await fetch(`/api/rankings/${params.id}/albums/${albumId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to remove album');

      const updatedAlbums = ranking.albums
        .filter(album => album.id !== albumId)
        .map((album, index) => ({
          ...album,
          rank: index + 1
        }));

      setRanking({
        ...ranking,
        albums: updatedAlbums
      });
    } catch (error) {
      console.error('Error removing album:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-accent"></div>
      </div>
    );
  }

  if (!ranking) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-text-secondary mb-4">Ranking not found</p>
          <Link href="/rankings" className="btn-primary">
            Back to Rankings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        {isEditing ? (
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={rankingName}
              onChange={(e) => setRankingName(e.target.value)}
              className="input-field text-2xl font-bold"
              autoFocus
            />
            <button
              onClick={handleSaveTitle}
              className="btn-primary"
              disabled={!rankingName.trim()}
            >
              <Save className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-text-primary">{ranking.name}</h1>
            <button
              onClick={() => setIsEditing(true)}
              className="text-text-secondary hover:text-text-primary"
            >
              <Edit2 className="w-5 h-5" />
            </button>
          </div>
        )}

        <Link href="/search" className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Album
        </Link>
      </div>

      {ranking.albums.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-text-secondary mb-4">This ranking is empty</p>
          <Link href="/search" className="btn-primary inline-flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Your First Album
          </Link>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="albums">
            {(provided: DroppableProvided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2"
              >
                {ranking.albums.map((album, index) => (
                  <Draggable key={album.id} draggableId={album.id} index={index}>
                    {(provided: DraggableProvided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="album-card flex items-center gap-4"
                      >
                        <div
                          {...provided.dragHandleProps}
                          className="text-text-secondary hover:text-text-primary cursor-grab"
                        >
                          <GripVertical className="w-5 h-5" />
                        </div>
                        <div className="w-12 h-12 relative flex-shrink-0">
                          <img
                            src={album.imageUrl}
                            alt={`${album.name} cover`}
                            className="w-full h-full object-cover rounded-md"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-text-primary truncate">
                            {album.rank}. {album.name}
                          </p>
                          <p className="text-text-secondary truncate">{album.artist}</p>
                        </div>
                        <button
                          onClick={() => removeAlbum(album.id)}
                          className="text-text-secondary hover:text-red-500 p-2"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
} 