import { put } from '@vercel/blob'

/**
 * Upload a file to Vercel Blob and return its public URL.
 * @param file - The file to upload
 * @param folder - Storage folder prefix (e.g. 'projects', 'icons')
 */
export async function uploadToBlob(file: File, folder = 'uploads'): Promise<string> {
  const ext = file.name.split('.').pop() ?? 'bin'
  const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const blob = await put(filename, file, {
    access: 'public',
    contentType: file.type,
  })

  return blob.url
}
