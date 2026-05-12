"use client";

import {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";

export type Track = {
  id: string;
  title: string;
  artist: string;
  youtube_video_id: string;
  order: number;
};

type YTPlayer = {
  loadVideoById: (videoId: string) => void;
  playVideo: () => void;
  pauseVideo: () => void;
};

type PlayerContextType = {
  currentTrack: Track | null;
  isPlaying: boolean;
  tracks: Track[];
  playTrack: (track: Track, playlist?: Track[]) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrev: () => void;
};

const PlayerContext = createContext<PlayerContextType | null>(null);

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const playerRef = useRef<YTPlayer | null>(null);
  const pendingTrackRef = useRef<Track | null>(null);
  const playNextRef = useRef<() => void>(() => {});
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    window.onYouTubeIframeAPIReady = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      playerRef.current = new (window as any).YT.Player("yt-player-global", {
        height: "0",
        width: "0",
        playerVars: { autoplay: 1, playsinline: 1 },
        events: {
          onReady: () => {
            if (pendingTrackRef.current) {
              playerRef.current?.loadVideoById(
                pendingTrackRef.current.youtube_video_id
              );
              pendingTrackRef.current = null;
            }
          },
          onStateChange: (event: { data: number }) => {
            setIsPlaying(event.data === 1);
            if (event.data === 0) playNextRef.current();
          },
        },
      });
    };
  }, []);

  const playTrack = useCallback((track: Track, playlist?: Track[]) => {
    if (playlist) setTracks(playlist);
    setCurrentTrack(track);
    if (playerRef.current) {
      playerRef.current.loadVideoById(track.youtube_video_id);
    } else {
      pendingTrackRef.current = track;
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  }, [isPlaying]);

  const playNext = useCallback(() => {
    setTracks((prev) => {
      setCurrentTrack((cur) => {
        if (!cur) return cur;
        const idx = prev.findIndex((t) => t.id === cur.id);
        if (idx < prev.length - 1) {
          const next = prev[idx + 1];
          playerRef.current?.loadVideoById(next.youtube_video_id);
          return next;
        }
        return cur;
      });
      return prev;
    });
  }, []);

  const playPrev = useCallback(() => {
    setTracks((prev) => {
      setCurrentTrack((cur) => {
        if (!cur) return cur;
        const idx = prev.findIndex((t) => t.id === cur.id);
        if (idx > 0) {
          const prevTrack = prev[idx - 1];
          playerRef.current?.loadVideoById(prevTrack.youtube_video_id);
          return prevTrack;
        }
        return cur;
      });
      return prev;
    });
  }, []);

  useEffect(() => {
    playNextRef.current = playNext;
  }, [playNext]);

  return (
    <PlayerContext.Provider
      value={{ currentTrack, isPlaying, tracks, playTrack, togglePlay, playNext, playPrev }}
    >
      {children}
      <div id="yt-player-global" className="hidden" />
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
};
