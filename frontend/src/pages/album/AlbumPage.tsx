import { useMusicStore } from "@/stores/useMusicStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Clock, Play } from "lucide-react";

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const AlbumPage = () => {
  const { albumId } = useParams();
  const { fetchAlbumById, currentAlbum, isLoading } = useMusicStore();
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    console.log("AlbumPage mounted, albumId:", albumId);
    if (albumId) {
      console.log("Fetching album with ID:", albumId);
      fetchAlbumById(albumId);
    }
  }, [fetchAlbumById, albumId]);

  useEffect(() => {
    if (currentAlbum) {
      setImageError(false);
      setImageLoading(true);
    }
  }, [currentAlbum]);

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.log("Image failed to load:", currentAlbum?.ImageUrl);
    setImageError(true);
    setImageLoading(false);
    e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQwIiBoZWlnaHQ9IjI0MCIgdmlld0JveD0iMCAwIDI0MCAyNDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNDAiIGhlaWdodD0iMjQwIiBmaWxsPSIjMzczNzM3Ii8+CjxwYXRoIGQ9Ik0xMjAgODBMMTYwIDEyMEgxNDBWMTYwSDEwMFYxMjBIODBMMTIwIDgwWiIgZmlsbD0iIzc1NzU3NSIvPgo8L3N2Zz4K";
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-white">Loading album...</div>
      </div>
    );
  }

  if (!currentAlbum) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-white">
          <p>Album not found</p>
          <p className="text-sm text-zinc-400">Album ID: {albumId}</p>
        </div>
      </div>
    );
  }

  const getImageSrc = () => {
    if (imageError || !currentAlbum?.ImageUrl) {
      return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQwIiBoZWlnaHQ9IjI0MCIgdmlld0JveD0iMCAwIDI0MCAyNDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNDAiIGhlaWdodD0iMjQwIiBmaWxsPSIjMzczNzM3Ii8+CjxwYXRoIGQ9Ik0xMjAgODBMMTYwIDEyMEgxNDBWMTYwSDEwMFYxMjBIODBMMTIwIDgwWiIgZmlsbD0iIzc1NzU3NSIvPgo8L3N2Zz4K";
    }
    return currentAlbum.ImageUrl;
  };

  const getSongImageSrc = (song: any) => {
    if (song.imageUrl && song.imageUrl.trim() !== "") {
      return song.imageUrl;
    }
    if (currentAlbum?.ImageUrl && !imageError) {
      return currentAlbum.ImageUrl;
    }
    return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjMzczNzM3Ii8+CjxwYXRoIGQ9Ik0yMCAxNEwyNiAyMEgyM1YyNkgxN1YyMEgxNEwyMCAxNFoiIGZpbGw9IiM3NTc1NzUiLz4KPC9zdmc+Cg==";
  };

  return (
    <div className="h-full">
      <ScrollArea className="h-full rounded-md rounded-md">
        <div className="relative min-h-full">
          <div
            className="absolute inset-0 bg-gradient-to-b from-[#5038a0]/80 via-zinc-900/80 to-zinc-900 pointer-events-none"
            aria-hidden="true"
          />
          <div className="relative z-10">
            <div className="flex p-6 gap-6 pb-8">
              <div className="relative">
                {imageLoading && !imageError && (
                  <div className="absolute inset-0 bg-zinc-800 rounded flex items-center justify-center">
                    <div className="text-zinc-400 text-sm">Loading...</div>
                  </div>
                )}
                <img
                  src={getImageSrc()}
                  alt={currentAlbum?.title || "Album cover"}
                  className="w-[240px] h-[240px] shadow-xl rounded object-cover"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  style={{ display: imageLoading ? "none" : "block" }}
                />
              </div>
              <div className="flex flex-col justify-end">
                <p className="text-sm font-medium text-zinc-300">Album</p>
                <h1 className="text-7xl font-bold my-4 text-white">
                  {currentAlbum?.title || "Unknown Album"}
                </h1>
                <div className="flex items-center gap-2 text-sm text-zinc-100">
                  <span className="font-medium text-white">
                    {currentAlbum?.artist || "Unknown Artist"}
                  </span>
                  <span>• {currentAlbum?.songs?.length || 0} songs</span>
                  <span>• {currentAlbum?.releaseYear || "Unknown Year"}</span>
                </div>
              </div>
            </div>

            <div className="px-6 pb-4 flex items-center gap-6">
              <Button
                size="icon"
                className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 hover:scale-105 transition-all"
              >
                <Play className="h-7 w-7 text-black" />
              </Button>
            </div>

            <div className="bg-black/20 backdrop-blur-sm">
              <div className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-10 py-2 text-sm text-zinc-400 border-b border-white/5">
                <div>#</div>
                <div>Title</div>
                <div>Released Date</div>
                <div>
                  <Clock className="h-4 w-4" />
                </div>
              </div>

              <div className="px-6">
                <div className="space-y-2 py-4">
                  {currentAlbum?.songs?.map((song, index) => (
                    <div
                      key={song._id}
                      className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 text-sm text-zinc-400 hover:bg-white/5 rounded-md group cursor-pointer"
                    >
                      <div className="flex items-center justify-center">
                        <span className="group-hover:hidden">{index + 1}</span>
                        <Play className="h-4 w-4 hidden group-hover:block" />
                      </div>

                      <div className="flex items-center gap-3">
                        <img
                          src={getSongImageSrc(song)}
                          alt={song.title}
                          className="size-10 rounded object-cover"
                          onError={(e) => {
                            e.currentTarget.src =
                              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjMzczNzM3Ii8+CjxwYXRoIGQ9Ik0yMCAxNEwyNiAyMEgyM1YyNkgxN1YyMEgxNEwyMCAxNFoiIGZpbGw9IiM3NTc1NzUiLz4KPC9zdmc+Cg==";
                          }}
                        />
                        <div>
                          <div className="font-medium text-white">{song.title}</div>
                          <div className="text-zinc-400">{song.artist}</div>
                        </div>
                      </div>

                      <div className="flex items-center">
                        {song.createdAt ? song.createdAt.split("T")[0] : "Unknown"}
                      </div>

                      <div className="flex items-center">
                        {formatDuration(song.duration)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default AlbumPage;