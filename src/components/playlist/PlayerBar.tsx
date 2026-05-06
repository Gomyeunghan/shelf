'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { HugeiconsIcon } from '@hugeicons/react'
import { PreviousIcon, PlayIcon, PauseIcon, NextIcon } from '@hugeicons/core-free-icons'

type Track = {
  id: string
  title: string
  artist: string
  youtube_video_id: string
  order: number
}

type Props = {
  track: Track
  isPlaying: boolean
  onTogglePlay: () => void
  onNext: () => void
  onPrev: () => void
}

const PlayerBar = ({ track, isPlaying, onTogglePlay, onNext, onPrev }: Props) => {
  const thumbnail = `https://img.youtube.com/vi/${track.youtube_video_id}/mqdefault.jpg`

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-md border-t border-border px-4 py-3 flex items-center gap-3 z-20">
      <Image
        src={thumbnail}
        alt={track.title}
        width={48}
        height={36}
        className="rounded-md object-cover shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{track.title}</p>
        <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <Button variant="ghost" size="icon-sm" onClick={onPrev}>
          <HugeiconsIcon icon={PreviousIcon} strokeWidth={2} />
        </Button>
        <Button variant="ghost" size="icon-sm" onClick={onTogglePlay}>
          <HugeiconsIcon icon={isPlaying ? PauseIcon : PlayIcon} strokeWidth={2} />
        </Button>
        <Button variant="ghost" size="icon-sm" onClick={onNext}>
          <HugeiconsIcon icon={NextIcon} strokeWidth={2} />
        </Button>
      </div>
    </div>
  )
}

export default PlayerBar
