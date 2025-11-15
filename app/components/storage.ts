export function load<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const val = localStorage.getItem(key)
    return val ? (JSON.parse(val) as T) : fallback
  } catch {
    return fallback
  }
}

export function save<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {}
}
