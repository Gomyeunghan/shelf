import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import PlaylistDetailClient from '@/components/playlist/PlaylistDetailClient'

export type Track = {
  id: string
  title: string
  artist: string
  youtube_video_id: string
  order: number
}

const PlaylistDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: playlist } = await supabase
    .from('Playlist')
    .select('id, title, cover_image, user_id')
    .eq('id', id)
    .single()

  if (!playlist) notFound()

  const { data: tracks } = await supabase
    .from('Track')
    .select('id, title, artist, youtube_video_id, "order"')
    .eq('playlist_id', id)
    .order('order', { ascending: true })

  return (
    <PlaylistDetailClient
      playlist={playlist}
      tracks={tracks ?? []}
      isOwner={playlist.user_id === user.id}
    />
  )
}

export default PlaylistDetailPage
