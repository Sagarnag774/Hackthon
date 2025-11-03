
export interface Artwork {
  title: string;
  artist: string;
  year: string;
  description: string;
  style: string;
  context: string;
  related_works: {
    title: string;
    artist: string;
  }[];
  error?: string;
  scannedImage?: string;
}

export interface Tour {
  id: string;
  title: string;
  description: string;
  artworks: {
    title: string;
    story: string;
  }[];
}

export type View = 'scanner' | 'tours' | 'detail';
