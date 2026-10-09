/**
 * photoLoader.js
 * Secure photo loader that accesses encrypted photos through the authenticated server API.
 * Preserves all visual formatting (rotations, washi tape colors, alignments, and masonry variants).
 */

let cachedPhotos = [];

/**
 * Fetch authenticated photos metadata from the secure server endpoint.
 * Requires active PIN session.
 */
export async function fetchProtectedPhotos() {
  try {
    const res = await fetch('/api/photos', {
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      },
      credentials: 'same-origin'
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    if (Array.isArray(data)) {
      cachedPhotos = data;
      return data;
    }
    return [];
  } catch (err) {
    console.error('Failed to fetch protected photos:', err);
    return [];
  }
}

/**
 * Synchronous accessor for currently loaded photos.
 */
export const getAllPhotos = () => {
  return cachedPhotos;
};

/**
 * Update the in-memory cache of loaded photos.
 */
export const setCachedPhotos = (photos) => {
  if (Array.isArray(photos)) {
    cachedPhotos = photos;
  }
};
