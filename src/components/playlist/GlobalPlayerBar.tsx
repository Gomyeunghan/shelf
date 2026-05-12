"use client";

import Image from "next/image";
import { usePlayer } from "@/contexts/PlayerContext";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { PreviousIcon, PlayIcon, PauseIcon, NextIcon } from "@hugeicons/core-free-icons";

const GlobalPlayerBar = () => {
  const { currentTrack, isPlaying, togglePlay, playNext, playPrev } = usePlayer();

  if (!currentTrack) return null;

  return (
    <div className="sticky bottom-0 bg-background/90 backdrop-blur-md border-t border-border px-4 py-3 flex items-center gap-3 z-20">
      <Image
        src={`https://img.youtube.com/vi/${currentTrack.youtube_video_id}/mqdefault.jpg`}
        alt={currentTrack.title}
        width={48}
        height={36}
        className="rounded-md object-cover shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{currentTrack.title}</p>
        <p className="text-xs text-muted-foreground truncate">{currentTrack.artist}</p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <Button variant="ghost" size="icon-sm" onClick={playPrev}>
          <HugeiconsIcon icon={PreviousIcon} strokeWidth={2} />
        </Button>
        <Button variant="ghost" size="icon-sm" onClick={togglePlay}>
          <HugeiconsIcon icon={isPlaying ? PauseIcon : PlayIcon} strokeWidth={2} />
        </Button>
        <Button variant="ghost" size="icon-sm" onClick={playNext}>
          <HugeiconsIcon icon={NextIcon} strokeWidth={2} />
        </Button>
      </div>
    </div>
  );
};

export default GlobalPlayerBar;
