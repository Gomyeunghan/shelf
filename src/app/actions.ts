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
