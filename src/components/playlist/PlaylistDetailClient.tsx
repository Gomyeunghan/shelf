'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { deletePlaylist, removeTrack } from '@/app/actions'
import EditPlaylistDialog from '@/components/home/EditPlaylistDialog'
import AddTrackDialog from '@/components/playlist/AddTrackDialog'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowLeft01Icon, Edit01Icon, Delete01Icon, Add01Icon, MusicNote01Icon } from '@hugeicons/core-free-icons'

type Playlist = {
  id: string
  title: string
  cover_image: string | null
}

type Track = {
  id: string
  title: string
  artist: string
  youtube_video_id: string
  order: number
}

type Props = {
  playlist: Playlist
  tracks: Track[]
}

const PlaylistDetailClient = ({ playlist, tracks }: Props) => {
  const router = useRouter()
  const [editOpen, setEditOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleDeletePlaylist = () => {
    if (!confirm('플레이리스트를 삭제할까요?')) return
    startTransition(async () => {
      const result = await deletePlaylist(playlist.id)
      if (!result?.error) router.push('/home')
    })
  }

  const handleRemoveTrack = (trackId: string) => {
    startTransition(async () => {
      await removeTrack(trackId, playlist.id)
    })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center gap-2 p-4 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <Button variant="ghost" size="icon-sm" onClick={() => router.back()}>
          <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} />
        </Button>
        <h1 className="flex-1 text-lg font-semibold truncate">{playlist.title}</h1>
        <Button variant="ghost" size="icon-sm" onClick={() => setEditOpen(true)}>
          <HugeiconsIcon icon={Edit01Icon} strokeWidth={2} />
        </Button>
        <Button variant="ghost" size="icon-sm" disabled={isPending} onClick={handleDeletePlaylist}>
          <HugeiconsIcon icon={Delete01Icon} strokeWidth={2} />
        </Button>
      </header>

      <main className="flex-1 px-4 pb-24">
        {tracks.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-20 text-muted-foreground">
            <p className="text-sm">트랙이 없어요. 음악을 추가해보세요!</p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {tracks.map((track, index) => (
              <li key={track.id} className="flex items-center gap-3 py-3">
                <span className="text-muted-foreground text-xs w-5 text-right shrink-0">
                  {index + 1}
                </span>
                <div className="size-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <HugeiconsIcon icon={MusicNote01Icon} size={18} className="text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{track.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  disabled={isPending}
                  onClick={() => handleRemoveTrack(track.id)}
                >
                  <HugeiconsIcon icon={Delete01Icon} strokeWidth={2} />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </main>

      <div className="fixed bottom-6 right-6">
        <Button
          size="icon-lg"
          className="rounded-full shadow-lg"
          onClick={() => setAddOpen(true)}
        >
          <HugeiconsIcon icon={Add01Icon} strokeWidth={2} />
        </Button>
      </div>

      <EditPlaylistDialog
        playlist={playlist}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
      <AddTrackDialog
        playlistId={playlist.id}
        currentTrackCount={tracks.length}
        open={addOpen}
        onOpenChange={setAddOpen}
      />
    </div>
  )
}

export default PlaylistDetailClient
