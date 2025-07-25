export interface Song {
    _id: string;
    title: string;
    artist: string;
    albumId: string | null;
    ImageUrl: string;
    audioUrl: string;
    duration: number;
    createdAt: string;
    updatedAt: string;
}

export interface Album {
    _id: string;
    title: string;
    artist: string;
    ImageUrl: string;
    releaseYear: number;
    songs: Song[];
}
