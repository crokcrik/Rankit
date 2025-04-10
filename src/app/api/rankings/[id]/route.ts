import { NextResponse } from 'next/server';
import { rankings } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const ranking = rankings.find(r => r.id === params.id);
  
  if (!ranking) {
    return NextResponse.json(
      { error: 'Ranking not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(ranking);
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const ranking = rankings.find((r: Ranking) => r.id === params.id);
  
  if (!ranking) {
    return NextResponse.json(
      { error: 'Ranking not found' },
      { status: 404 }
    );
  }

  const data = await request.json();
  
  if (data.name) {
    ranking.name = data.name;
  }

  if (data.coverAlbumId) {
    // Move the selected album to the front of the array
    const albumIndex = ranking.albums.findIndex(a => a.id === data.coverAlbumId);
    if (albumIndex !== -1) {
      const [album] = ranking.albums.splice(albumIndex, 1);
      ranking.albums.unshift(album);
      // Update ranks
      ranking.albums.forEach((a, i) => {
        a.rank = i + 1;
      });
    }
  }

  return NextResponse.json(ranking);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const index = rankings.findIndex(r => r.id === params.id);
  
  if (index === -1) {
    return NextResponse.json(
      { error: 'Ranking not found' },
      { status: 404 }
    );
  }

  rankings.splice(index, 1);
  return NextResponse.json({ message: 'Ranking deleted successfully' });
} 