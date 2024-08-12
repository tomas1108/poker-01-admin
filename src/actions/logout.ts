'use server'

import { signOut } from '@/auth'
import { currentUser } from '@/lib/auth'
import userApi from '@/services/api/modules/user-api'
import { clearSession } from '@/utils/auth'
import { toast } from 'sonner'

export const logout = async () => {
  const user = await currentUser();
  try {
    await userApi.logout({ username: user?.username})
    await signOut()
    return true
  } catch (error) {
    throw error
  }
}
