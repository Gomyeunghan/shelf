'use client'

import { useState, useTransition } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { createPlaylist } from '@/app/actions'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const CreatePlaylistDialog = ({ open, onOpenChange }: Props) => {
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleSubmit = () => {
    if (!title.trim()) {
      setError('제목을 입력해주세요')
      return
    }
    startTransition(async () => {
      const result = await createPlaylist({ title })
      if (result?.error) {
        setError(result.error)
      } else {
        setTitle('')
        setError('')
        onOpenChange(false)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 플레이리스트</DialogTitle>
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
            {isPending ? '만드는 중...' : '만들기'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CreatePlaylistDialog
