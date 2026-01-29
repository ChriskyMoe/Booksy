'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { updateBusinessAvatar, deleteBusinessAvatar } from '@/lib/actions/business'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
interface AvatarUploadFormProps {
  currentAvatarUrl: string | null
}

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB

export default function AvatarUploadForm({ currentAvatarUrl }: AvatarUploadFormProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  // Track the last-saved avatar URL so UI updates immediately on delete/upload,
  // instead of waiting for the server component to re-render with new props.
  const [savedAvatarUrl, setSavedAvatarUrl] = useState<string | null>(currentAvatarUrl)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatarUrl)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Only image files are allowed.')
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      setError('Image must be smaller than 2MB.')
      return
    }

    setError(null)
    setAvatarFile(file)

    const reader = new FileReader()
    reader.onloadend = () => setPreviewUrl(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleUpdateSubmit = async () => {
    if (!avatarFile) return

    setIsUploading(true)
    setError(null)

    const formData = new FormData()
    formData.append('avatar', avatarFile)

    const result = await updateBusinessAvatar(formData)

    setIsUploading(false)
    setAvatarFile(null)

    if (result?.error) {
      setError(result.error)
    } else {
      const newUrl =
        (result as { data?: { avatar_url?: string | null } })?.data?.avatar_url ?? null
      if (newUrl) {
        setSavedAvatarUrl(newUrl)
        setPreviewUrl(newUrl)
      }
      router.refresh()
    }
  }

  const handleDeleteAvatar = async () => {
    setIsDeleting(true)
    setError(null)

    const result = await deleteBusinessAvatar()

    setIsDeleting(false)

    if (result?.error) {
      setError(result.error)
    } else {
      setSavedAvatarUrl(null)
      setPreviewUrl(null)
      setAvatarFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      router.refresh()
    }
  }

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-6">Business Avatar</h3>

      <div className="flex flex-col items-center gap-4">
        {/* Avatar */}
        <div
          className="relative w-36 h-36 rounded-full overflow-hidden border bg-muted cursor-pointer group"
          onClick={() => fileInputRef.current?.click()}
        >
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="Avatar"
              fill
              className="object-cover transition-opacity group-hover:opacity-80"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
              No Avatar
            </div>
          )}

          <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white bg-black/40 opacity-0 group-hover:opacity-100 transition">
            Change
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {!!savedAvatarUrl && !avatarFile && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteAvatar}
              disabled={isUploading || isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          )}
        </div>

        {/* File input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {avatarFile && (
          <p className="text-xs text-muted-foreground">
            Selected: {avatarFile.name}
          </p>
        )}

        {error && (
          <p className="text-sm text-destructive text-center">{error}</p>
        )}

        {avatarFile && (
          <Button onClick={handleUpdateSubmit} disabled={isUploading}>
            {isUploading ? 'Saving...' : 'Save Avatar'}
          </Button>
        )}
      </div>

    </div>
  )
}
