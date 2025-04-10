import { NextResponse } from 'next/server';

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
  createdAt: string;
  albums: Album[];
}

// For now, we'll store rankings in memory
// In a real app, this would be in a database
export const rankings: Ranking[] = [];

export async function GET() {
  return NextResponse.json(rankings);
}

export async function POST(request: Request) {
  const data = await request.json();
  
  if (!data.name) {
    return NextResponse.json(
      { error: 'Ranking name is required' },
      { status: 400 }
    );
  }

  const newRanking: Ranking = {
    id: Date.now().toString(), // In a real app, use a proper ID generator
    name: data.name,
    createdAt: new Date().toISOString(),
    albums: data.album ? [
      {
        id: data.album.id,
        name: data.album.name,
        artist: data.album.artists[0]?.name || 'Unknown Artist',
        imageUrl: data.album.images[0]?.url || '',
        rank: 1,
      }
    ] : [],
  };

  rankings.push(newRanking);
  return NextResponse.json(newRanking);
}

export async function PUT(request: Request) {
  const data = await request.json();
  
  if (!data.rankingId || !data.album) {
    return NextResponse.json(
      { error: 'Ranking ID and album are required' },
      { status: 400 }
    );
  }

  const ranking = rankings.find((r: Ranking) => r.id === data.rankingId);
  if (!ranking) {
    return NextResponse.json(
      { error: 'Ranking not found' },
      { status: 404 }
    );
  }

  // Add the album to the ranking if it's not already there
  if (!ranking.albums.some((a: Album) => a.id === data.album.id)) {
    ranking.albums.push({
      id: data.album.id,
      name: data.album.name,
      artist: data.album.artists[0]?.name || 'Unknown Artist',
      imageUrl: data.album.images[0]?.url || '',
      rank: ranking.albums.length + 1,
    });
  }

  return NextResponse.json(ranking);
} 