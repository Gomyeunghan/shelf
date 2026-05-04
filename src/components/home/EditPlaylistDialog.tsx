'use client'

import { useState, useTransition, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { updatePlaylist } from '@/app/actions'

type Playlist = {
  id: string
  title: string
}

type Props = {
  playlist: Playlist | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const EditPlaylistDialog = ({ playlist, open, onOpenChange }: Props) => {
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (playlist) {
      setTitle(playlist.title)
      setError('')
    }
  }, [playlist])

  const handleSubmit = () => {
    if (!title.trim()) {
      setError('제목을 입력해주세요')
      return
    }
    if (!playlist) return
    startTransition(async () => {
      const result = await updatePlaylist({ id: playlist.id, title })
      if (result?.error) {
        setError(result.error)
      } else {
        onOpenChange(false)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>플레이리스트 편집</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Input
            placeholder="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          {error && <p className="text-destructive text-sm">{error}</p>}
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isPending} className="w-full">
            {isPending ? '저장 중...' : '저장'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditPlaylistDialog
