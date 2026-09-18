const STORAGE_KEY = 'anstumovie_continue_watching'
const MAX_ITEMS = 20

export function getContinueWatching() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (err) {
    console.error('Failed to read continue watching list:', err)
    return []
  }
}

// item shape: { id, media_type: 'movie' | 'tv', title/name, poster_path, release_date/first_air_date }
export function addToContinueWatching(item) {
  try {
    const existing = getContinueWatching()

    const withoutThisItem = existing.filter(
      (entry) =>
        !(entry.id === item.id && entry.media_type === item.media_type)
    )

    const updated = [
      { ...item, watchedAt: Date.now() },
      ...withoutThisItem,
    ].slice(0, MAX_ITEMS)

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch (err) {
    console.error('Failed to update continue watching list:', err)
  }
}