import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ShelfClient from '@/components/home/ShelfClient'

export type Playlist = {
  id: string
  title: string
  cover_image: string | null
  created_at: string
  Track?: { id: string }[]
}

const HomePage = async () => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('User')
    .select('nickname')
    .eq('id', user.id)
    .single()

  const { data: playlists } = await supabase
    .from('Playlist')
    .select('id, title, cover_image, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <ShelfClient
      nickname={profile?.nickname ?? user.email ?? ''}
      playlists={(playlists ?? []) as Playlist[]}
    />
  )
}

export default HomePage
