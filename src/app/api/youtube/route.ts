import { NextRequest } from 'next/server'

export const GET = async (request: NextRequest) => {
  try {
    const q = request.nextUrl.searchParams.get('q')
    if (!q) return Response.json({ items: [] })

    const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY
    console.log('[youtube] apiKey exists:', !!apiKey)
    if (!apiKey) return Response.json({ error: 'YouTube API key not configured' }, { status: 500 })

    const url = new URL('https://www.googleapis.com/youtube/v3/search')
    url.searchParams.set('part', 'snippet')
    url.searchParams.set('type', 'video')
    url.searchParams.set('maxResults', '10')
    url.searchParams.set('q', q)
    url.searchParams.set('key', apiKey)

    console.log('[youtube] fetching:', url.toString().replace(apiKey, '***'))

    const res = await fetch(url.toString())
    const data = await res.json()

    console.log('[youtube] status:', res.status, !res.ok ? 'error:' : '', !res.ok ? data : '')

    if (!res.ok) return Response.json({ error: data.error?.message ?? 'YouTube API error' }, { status: 502 })

    type YouTubeItem = {
      id: { videoId: string }
      snippet: {
        title: string
        channelTitle: string
        thumbnails: { medium: { url: string } }
      }
    }

    const items = (data.items ?? [])
      .filter((item: YouTubeItem) => !!item.id.videoId)
      .map((item: YouTubeItem) => ({
        videoId: item.id.videoId,
        title: item.snippet.title,
        artist: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails?.medium?.url ?? '',
      }))

    return Response.json({ items })
  } catch (e) {
    console.error('[youtube] unexpected error:', e)
    return Response.json({ error: String(e) }, { status: 500 })
  }
}
