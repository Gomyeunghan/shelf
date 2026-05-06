'use client'

import { useRef, useState, useCallback, useEffect } from 'react'

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void
  }
}

type Track = {
  id: string
  title: string
  artist: string
  youtube_video_id: string
  order: number
}

type YTPlayer = {
  loadVideoById: (videoId: string) => void
  playVideo: () => void
  pauseVideo: () => void
}

const useYouTubePlayer = (tracks: Track[]) => {
  const playerRef = useRef<YTPlayer | null>(null)
  const pendingTrackRef = useRef<Track | null>(null)
  const playNextRef = useRef<() => void>(() => {})
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    window.onYouTubeIframeAPIReady = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      playerRef.current = new (window as any).YT.Player('yt-player', {
        height: '0',
        width: '0',
        playerVars: { autoplay: 1, playsinline: 1 },
        events: {
          onReady: () => {
            if (pendingTrackRef.current) {
              playerRef.current?.loadVideoById(pendingTrackRef.current.youtube_video_id)
              pendingTrackRef.current = null
            }
          },
          onStateChange: (event: { data: number }) => {
            setIsPlaying(event.data === 1)
            if (event.data === 0) playNextRef.current()
          },
        },
      })
    }
  }, [])

  const playTrack = useCallback((track: Track) => {
    setCurrentTrack(track)
    if (playerRef.current) {
      playerRef.current.loadVideoById(track.youtube_video_id)
    } else {
      pendingTrackRef.current = track
    }
  }, [])

  const togglePlay = useCallback(() => {
    if (!playerRef.current) return
    if (isPlaying) {
      playerRef.current.pauseVideo()
    } else {
      playerRef.current.playVideo()
    }
  }, [isPlaying])

  const playNext = useCallback(() => {
    if (!currentTrack) return
    const idx = tracks.findIndex(t => t.id === currentTrack.id)
    if (idx < tracks.length - 1) playTrack(tracks[idx + 1])
  }, [currentTrack, tracks, playTrack])

  const playPrev = useCallback(() => {
    if (!currentTrack) return
    const idx = tracks.findIndex(t => t.id === currentTrack.id)
    if (idx > 0) playTrack(tracks[idx - 1])
  }, [currentTrack, tracks, playTrack])

  // playNextRef를 항상 최신 함수로 유지
  useEffect(() => {
    playNextRef.current = playNext
  }, [playNext])

  return { playTrack, togglePlay, playNext, playPrev, currentTrack, isPlaying }
}

export default useYouTubePlayer
