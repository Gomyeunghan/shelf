import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ShelfClient from '@/components/home/ShelfClient'

export type Playlist = {
  id: string
  title: string
  cover_image: string | null
  created_at: string
  Track: { count: number }[]
}

export type Group = {
  id: string
  name: string
  invite_code: string
  created_by: string
  GroupMember: { count: number }[]
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
    .select('id, title, cover_image, created_at, Track(count)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const { data: groups } = await supabase
    .from('Group')
    .select('id, name, invite_code, created_by, GroupMember(count)')
    .order('created_at', { ascending: false })

  return (
    <ShelfClient
      userId={user.id}
      nickname={profile?.nickname ?? user.email ?? ''}
      playlists={(playlists ?? []) as Playlist[]}
      groups={(groups ?? []) as Group[]}
    />
  )
}

export default HomePage
