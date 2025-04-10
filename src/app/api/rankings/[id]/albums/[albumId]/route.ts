import { NextResponse } from 'next/server';
import { rankings, type Ranking, type Album } from '../../../route';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; albumId: string } }
) {
  const ranking = rankings.find((r: Ranking) => r.id === params.id);
  
  if (!ranking) {
    return NextResponse.json(
      { error: 'Ranking not found' },
      { status: 404 }
    );
  }

  const albumIndex = ranking.albums.findIndex((a: Album) => a.id === params.albumId);
  
  if (albumIndex === -1) {
    return NextResponse.json(
      { error: 'Album not found in ranking' },
      { status: 404 }
    );
  }

  ranking.albums.splice(albumIndex, 1);
  
  // Update ranks for remaining albums
  ranking.albums.forEach((album: Album, index: number) => {
    album.rank = index + 1;
  });

  return NextResponse.json(ranking);
} 