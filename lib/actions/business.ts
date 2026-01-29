'use server'

import { createClient } from '@/lib/supabase/server'

export async function getBusiness() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error) {
    return { error: error.message }
  }

  return { data }
}

export async function updateBusiness(updates: {
  name?: string
  business_type?: string
  base_currency?: string
  fiscal_year_start_month?: number
  fiscal_year_start_day?: number
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { data, error } = await supabase
    .from('businesses')
    .update(updates)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  return { data }
}

export async function deleteBusiness() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('businesses')
    .delete()
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  return { data: { success: true } }
}

export async function updateBusinessAvatar(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated', status: 401 }
  }

  const businessResult = await getBusiness()
  if (businessResult.error || !businessResult.data) {
    return { error: 'Business not found', status: 404 }
  }

  const business = businessResult.data
  const avatarFile = formData.get('avatar') as File

  if (!avatarFile || avatarFile.size === 0) {
    return { error: 'No avatar file provided', status: 400 }
  }

  const fileExtension = avatarFile.name.split('.').pop() || 'png'
  const newAvatarPath = `${user.id}/avatar-${Date.now()}.${fileExtension}`

  // Upload new avatar
  const { error: uploadError } = await supabase.storage
    .from('business-avatars')
    .upload(newAvatarPath, avatarFile, {
      contentType: avatarFile.type || undefined,
      upsert: true,
    })

  if (uploadError) {
    console.error('Avatar upload error:', uploadError)
    return { error: uploadError.message || 'Failed to upload avatar', status: 500 }
  }

  // Get public URL
  const { data: publicUrlData } = supabase.storage
    .from('business-avatars')
    .getPublicUrl(newAvatarPath)

  if (!publicUrlData) {
    return { error: 'Failed to get public URL for avatar', status: 500 }
  }

  const newAvatarUrl = publicUrlData.publicUrl

  // If there's an old avatar, delete it from storage
  if (business.avatar_url) {
    const oldAvatarPath = business.avatar_url.split('/').slice(-2).join('/');
    if (oldAvatarPath) {
      await supabase.storage.from('business-avatars').remove([oldAvatarPath])
    }
  }

  // Update business record
  const { error: dbError } = await supabase
    .from('businesses')
    .update({ avatar_url: newAvatarUrl })
    .eq('user_id', user.id)

  if (dbError) {
    console.error('Database update error:', dbError)
    return { error: dbError.message || 'Failed to update business with new avatar', status: 500 }
  }

  return { data: { avatar_url: newAvatarUrl } }
}

export async function deleteBusinessAvatar() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated', status: 401 }
  }

  const businessResult = await getBusiness()
  if (businessResult.error || !businessResult.data) {
    return { error: 'Business not found', status: 404 }
  }

  const business = businessResult.data

  // If there's an old avatar, delete it from storage
  if (business.avatar_url) {
    const oldAvatarPath = business.avatar_url.split('/').slice(-2).join('/');
    if (oldAvatarPath) {
      const { error: removeError } = await supabase.storage.from('business-avatars').remove([oldAvatarPath])
      if (removeError) {
        console.error('Avatar deletion error:', removeError)
        return { error: 'Failed to delete avatar', status: 500 }
      }
    }
  }

  // Update business record to remove avatar_url
  const { error: dbError } = await supabase
    .from('businesses')
    .update({ avatar_url: null })
    .eq('user_id', user.id)

  if (dbError) {
    console.error('Database update error:', dbError)
    return { error: 'Failed to update business', status: 500 }
  }

  return { data: { success: true } }
}
