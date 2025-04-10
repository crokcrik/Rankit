export interface Album {
  id: string;
  name: string;
  artist: string;
  imageUrl: string;
  rank: number;
}

export interface Ranking {
  id: string;
  name: string;
  createdAt: string;
  albums: Album[];
}

// For now, we'll store rankings in memory
// In a real app, this would be in a database
export const rankings: Ranking[] = []; 