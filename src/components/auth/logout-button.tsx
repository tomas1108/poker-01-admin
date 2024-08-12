'use client'

import { logout } from '@/actions/logout'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

interface LogoutButtonProps {
  children?: React.ReactNode
  className?: string
}

export const LogoutButton = ({ children, className }: LogoutButtonProps) => {
  const router = useRouter()
  const onClick = async () => {
    const result = await logout()
    if (result) {
      window.location.assign('/auth/login')
    }
  }

  return (
    <span onClick={onClick} className={cn('cursor-pointer', className)}>
      {children}
    </span>
  )
}
