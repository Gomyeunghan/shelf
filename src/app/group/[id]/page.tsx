import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import GroupDetailClient from '@/components/group/GroupDetailClient'

export type GroupPlaylist = {
  Playlist: {
    id: string
    title: string
    cover_image: string | null
    user_id: string
    Track: { count: number }[]
    User: { nickname: string }
  }
}

export type GroupMemberItem = {
  user_id: string
  joined_at: string
  User: {
    nickname: string
    avatar: string | null
  }
}

const GroupDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: group } = await supabase
    .from('Group')
    .select('id, name, invite_code, created_by')
    .eq('id', id)
    .single()

  if (!group) notFound()

  const [{ data: members }, { data: groupPlaylists }, { data: myPlaylists }] = await Promise.all([
    supabase
      .from('GroupMember')
      .select('user_id, joined_at, User(nickname, avatar)')
      .eq('group_id', id),
    supabase
      .from('PlaylistGroup')
      .select('Playlist(id, title, cover_image, user_id, Track(count), User(nickname))')
      .eq('group_id', id),
    supabase
      .from('Playlist')
      .select('id, title')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
  ])

  return (
    <GroupDetailClient
      group={group}
      userId={user.id}
      members={members as unknown as GroupMemberItem[]}
      groupPlaylists={groupPlaylists as unknown as GroupPlaylist[]}
      myPlaylists={myPlaylists ?? []}
    />
  )
}

export default GroupDetailPage
