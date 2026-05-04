'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { addTrack } from '@/app/actions'
import { HugeiconsIcon } from '@hugeicons/react'
import { Search01Icon, Add01Icon } from '@hugeicons/core-free-icons'

type YouTubeItem = {
  videoId: string
  title: string
  artist: string
  thumbnail: string
}

type Props = {
  playlistId: string
  currentTrackCount: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

const AddTrackDialog = ({ playlistId, currentTrackCount, open, onOpenChange }: Props) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<YouTubeItem[]>([])
  const [searching, setSearching] = useState(false)
  const [addingId, setAddingId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSearch = async () => {
    if (!query.trim()) return
    setSearching(true)
    try {
      const res = await fetch(`/api/youtube?q=${encodeURIComponent(query)}`)
      const data = await res.json()
      setResults(data.items ?? [])
    } finally {
      setSearching(false)
    }
  }

  const handleAdd = (item: YouTubeItem) => {
    setAddingId(item.videoId)
    startTransition(async () => {
      await addTrack({
        playlistId,
        title: item.title,
        artist: item.artist,
        youtubeVideoId: item.videoId,
        order: currentTrackCount,
      })
      setAddingId(null)
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>트랙 추가</DialogTitle>
        </DialogHeader>
        <div className="flex gap-2">
          <Input
            placeholder="곡 이름 또는 아티스트 검색"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button size="icon" variant="outline" onClick={handleSearch} disabled={searching}>
            <HugeiconsIcon icon={Search01Icon} strokeWidth={2} />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto space-y-1 min-h-0">
          {searching && (
            <p className="text-center text-sm text-muted-foreground py-8">검색 중...</p>
          )}
          {!searching && results.length === 0 && query && (
            <p className="text-center text-sm text-muted-foreground py-8">검색 결과가 없어요</p>
          )}
          {results.map((item) => (
            <div key={item.videoId} className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted">
              <Image
                src={item.thumbnail}
                alt={item.title}
                width={64}
                height={48}
                className="rounded-lg object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.title}</p>
                <p className="text-xs text-muted-foreground truncate">{item.artist}</p>
              </div>
              <Button
                size="icon-sm"
                variant="outline"
                disabled={isPending && addingId === item.videoId}
                onClick={() => handleAdd(item)}
              >
                <HugeiconsIcon icon={Add01Icon} strokeWidth={2} />
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AddTrackDialog
