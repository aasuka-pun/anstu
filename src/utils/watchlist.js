const STORAGE_KEY = 'anstumovie_watchlist'

export function getWatchlist() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (err) {
    console.error('Failed to read watchlist:', err)
    return []
  }
}

export function isInWatchlist(id, mediaType) {
  return getWatchlist().some(
    (item) => item.id === id && item.media_type === mediaType
  )
}

// item shape: { id, media_type: 'movie' | 'tv', title/name, poster_path }
export function toggleWatchlist(item) {
  try {
    const existing = getWatchlist()
    const alreadyIn = existing.some(
      (entry) => entry.id === item.id && entry.media_type === item.media_type
    )

    const updated = alreadyIn
      ? existing.filter(
          (entry) =>
            !(entry.id === item.id && entry.media_type === item.media_type)
        )
      : [{ ...item, addedAt: Date.now() }, ...existing]

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    return !alreadyIn
  } catch (err) {
    console.error('Failed to update watchlist:', err)
    return false
  }
}