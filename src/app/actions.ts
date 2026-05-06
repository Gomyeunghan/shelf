'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export const createPlaylist = async (data: { title: string }) => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase.from('Playlist').insert({
    user_id: user.id,
    title: data.title.trim(),
  })

  if (error) return { error: error.message }

  revalidatePath('/home')
  return { success: true }
}

export const updatePlaylist = async (data: { id: string; title: string }) => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('Playlist')
    .update({ title: data.title.trim() })
    .eq('id', data.id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/home')
  return { success: true }
}

export const deletePlaylist = async (id: string) => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('Playlist')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/home')
  return { success: true }
}

export const addTrack = async (data: {
  playlistId: string
  title: string
  artist: string
  youtubeVideoId: string
  order: number
}) => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase.from('Track').insert({
    playlist_id: data.playlistId,
    title: data.title,
    artist: data.artist,
    youtube_video_id: data.youtubeVideoId,
    order: data.order,
  })

  if (error) return { error: error.message }

  revalidatePath(`/playlist/${data.playlistId}`)
  return { success: true }
}

export const removeTrack = async (trackId: string, playlistId: string) => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('Track')
    .delete()
    .eq('id', trackId)

  if (error) return { error: error.message }

  revalidatePath(`/playlist/${playlistId}`)
  return { success: true }
}

export const createGroup = async (data: { name: string }) => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data: group, error } = await supabase
    .from('Group')
    .insert({ name: data.name.trim(), created_by: user.id })
    .select('id')
    .single()

  if (error) return { error: error.message }

  // 생성자를 멤버로 자동 등록
  const { error: memberError } = await supabase
    .from('GroupMember')
    .insert({ group_id: group.id, user_id: user.id })

  if (memberError) return { error: memberError.message }

  revalidatePath('/home')
  return { success: true, groupId: group.id }
}

export const joinGroup = async (inviteCode: string) => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data: results } = await supabase
    .rpc('find_group_by_invite_code', { code: inviteCode.trim() })

  const group = results?.[0]
  if (!group) return { error: '유효하지 않은 초대 코드예요' }

  const { error } = await supabase
    .from('GroupMember')
    .insert({ group_id: group.id, user_id: user.id })

  if (error?.code === '23505') return { error: '이미 참가한 그룹이에요' }
  if (error) return { error: error.message }

  revalidatePath('/home')
  return { success: true, groupId: group.id }
}

export const leaveGroup = async (groupId: string) => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('GroupMember')
    .delete()
    .eq('group_id', groupId)
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/home')
  return { success: true }
}

export const addPlaylistToGroup = async (playlistId: string, groupId: string) => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('PlaylistGroup')
    .insert({ playlist_id: playlistId, group_id: groupId })

  if (error?.code === '23505') return { error: '이미 추가된 플레이리스트예요' }
  if (error) return { error: error.message }

  revalidatePath(`/group/${groupId}`)
  return { success: true }
}

export const removePlaylistFromGroup = async (playlistId: string, groupId: string) => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('PlaylistGroup')
    .delete()
    .eq('playlist_id', playlistId)
    .eq('group_id', groupId)

  if (error) return { error: error.message }

  revalidatePath(`/group/${groupId}`)
  return { success: true }
}
