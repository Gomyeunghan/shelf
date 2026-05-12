"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { deletePlaylist, removeTrack } from "@/app/actions";
import EditPlaylistDialog from "@/components/home/EditPlaylistDialog";
import AddTrackDialog from "@/components/playlist/AddTrackDialog";
import { usePlayer } from "@/contexts/PlayerContext";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  Edit01Icon,
  Delete01Icon,
  Add01Icon,
  PlayIcon,
} from "@hugeicons/core-free-icons";

const listVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -12 },
  show: { opacity: 1, x: 0, transition: { duration: 0.2, ease: "easeOut" } },
};

type Playlist = {
  id: string;
  title: string;
  cover_image: string | null;
};

type Track = {
  id: string;
  title: string;
  artist: string;
  youtube_video_id: string;
  order: number;
};

type Props = {
  playlist: Playlist;
  tracks: Track[];
  isOwner: boolean;
};

const PlaylistDetailClient = ({ playlist, tracks, isOwner }: Props) => {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const { playTrack, currentTrack, isPlaying } = usePlayer();

  const handleDeletePlaylist = () => {
    if (!confirm("플레이리스트를 삭제할까요?")) return;
    startTransition(async () => {
      const result = await deletePlaylist(playlist.id);
      if (!result?.error) router.push("/home");
    });
  };

  const handleRemoveTrack = (trackId: string) => {
    startTransition(async () => {
      await removeTrack(trackId, playlist.id);
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center gap-2 p-4 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <Button variant="ghost" size="icon-sm" onClick={() => router.back()}>
          <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} />
        </Button>
        <h1 className="flex-1 text-lg font-semibold truncate">{playlist.title}</h1>
        {isOwner && (
          <>
            <Button variant="ghost" size="icon-sm" onClick={() => setEditOpen(true)}>
              <HugeiconsIcon icon={Edit01Icon} strokeWidth={2} />
            </Button>
            <Button variant="ghost" size="icon-sm" disabled={isPending} onClick={handleDeletePlaylist}>
              <HugeiconsIcon icon={Delete01Icon} strokeWidth={2} />
            </Button>
          </>
        )}
      </header>

      <main className="flex-1 px-4 pb-24">
        {tracks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center gap-2 py-20 text-muted-foreground"
          >
            <p className="text-sm">트랙이 없어요. 음악을 추가해보세요!</p>
          </motion.div>
        ) : (
          <motion.ul
            className="divide-y divide-border"
            variants={listVariants}
            initial="hidden"
            animate="show"
          >
            {tracks.map((track, index) => {
              const isActive = currentTrack?.id === track.id;
              return (
                <motion.li
                  key={track.id}
                  variants={itemVariants}
                  className={`flex items-center gap-3 py-3 cursor-pointer rounded-lg px-2 -mx-2 transition-colors ${isActive ? "bg-muted" : "hover:bg-muted/50"}`}
                  onClick={() => playTrack(track, tracks)}
                >
                  <span className={`text-xs w-5 text-right shrink-0 ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                    {isActive && isPlaying ? (
                      <HugeiconsIcon icon={PlayIcon} size={14} className="text-primary" />
                    ) : (
                      index + 1
                    )}
                  </span>
                  <Image
                    src={`https://img.youtube.com/vi/${track.youtube_video_id}/mqdefault.jpg`}
                    alt={track.title}
                    width={56}
                    height={42}
                    className={`rounded-lg object-cover shrink-0 ${isActive ? "ring-2 ring-primary" : ""}`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${isActive ? "text-primary" : ""}`}>
                      {track.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                  </div>
                  {isOwner && (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      disabled={isPending}
                      onClick={(e) => { e.stopPropagation(); handleRemoveTrack(track.id); }}
                    >
                      <HugeiconsIcon icon={Delete01Icon} strokeWidth={2} />
                    </Button>
                  )}
                </motion.li>
              );
            })}
          </motion.ul>
        )}
      </main>

      {isOwner && (
        <div className="fixed bottom-6 right-6 z-10">
          <Button size="icon-lg" className="rounded-full shadow-lg" onClick={() => setAddOpen(true)}>
            <HugeiconsIcon icon={Add01Icon} strokeWidth={2} />
          </Button>
        </div>
      )}

      <EditPlaylistDialog playlist={playlist} open={editOpen} onOpenChange={setEditOpen} />
      <AddTrackDialog
        playlistId={playlist.id}
        currentTrackCount={tracks.length}
        open={addOpen}
        onOpenChange={setAddOpen}
      />
    </div>
  );
};

export default PlaylistDetailClient;
