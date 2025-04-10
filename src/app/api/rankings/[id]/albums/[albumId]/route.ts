import { NextResponse } from 'next/server';
import { rankings } from '@/lib/db';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; albumId: string } }
) {
  const ranking = rankings.find(r => r.id === params.id);
  
  if (!ranking) {
    return NextResponse.json(
      { error: 'Ranking not found' },
      { status: 404 }
    );
  }

  const albumIndex = ranking.albums.findIndex(a => a.id === params.albumId);
  
  if (albumIndex === -1) {
    return NextResponse.json(
      { error: 'Album not found in ranking' },
      { status: 404 }
    );
  }

  ranking.albums.splice(albumIndex, 1);
  
  // Update ranks for remaining albums
  ranking.albums.forEach((album, index) => {
    album.rank = index + 1;
  });

  return NextResponse.json(ranking);
} 