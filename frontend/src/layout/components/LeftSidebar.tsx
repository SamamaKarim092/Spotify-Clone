import { HomeIcon, MessageCircle, LibraryIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SignedIn } from "@clerk/clerk-react";
import PlaylistSkeleton from "@/components/skeletons/PlaylistSkeleton";
import { useEffect } from "react";
import { useMusicStore } from "@/stores/useMusicStore";


const LeftSidebar = () => {

  // data fetching => zustand
  const { albums , fetchAlbums ,isLoading} = useMusicStore();

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);
  
  console.log({ albums });
  

  return (
    <div className="h-full flex flex-col gap-2 ">
      {/* Navigation menu */}
      <div className="rounded-1g bg-zinc-900 p-4">
        <div className="space-y-2">
          <Link
            to="/"
            className={cn(
              buttonVariants({
                variant: "ghost",
                className: "w-full justify-start text-white hover:bg-zinc-100",
              })
            )}
          >
            <HomeIcon className="mr-2 size-5 "></HomeIcon>
            <span className="hidden md:inline">Home</span>
          </Link>

          <SignedIn>
            <Link
              to="/chat"
              className={cn(
                buttonVariants({
                  variant: "ghost",
                  className:
                    "w-full justify-start text-white hover:bg-zinc-100",
                })
              )}
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              <span className="hidden md:inline">Messages</span>
            </Link>
          </SignedIn>
        </div>
      </div>

      {/* Library Section */}
      <div className="flex-1 rounded-lg bg-zinc-900 p-4">
        <div className="flex item-center justify-between mb-4">
          <div className="flex items-center text-white px-2">
            <LibraryIcon className="size-5 mr-2" />
            <span className="hidden md:inline">Playlist</span>
          </div>
        </div>

       <ScrollArea className="h-[calc(100vh-300px)]">
          <div className="space-y-2 pr-4">
            {isLoading ? <PlaylistSkeleton /> : (
              albums.map((album) => (
                <Link
                to={`/albums/${album._id}`}
                key={album._id}
                className="p-2 hover:bg-zinc-800 rounded-md flex item-center gap-3 cursor-pointer">
                  <img src={album.ImageUrl} alt="Playlist img" className="size-12 rounded-md flex-shrink-0 object-cover"/>

                  <div className="flex-1 min-w-0 hidden md:block">
                    <p className="font-medium truncate">
                      {album.title}
                    </p>
                    <p className="text-sm text-zinc-400 truncate">
                      Album • {album.artist}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default LeftSidebar;
