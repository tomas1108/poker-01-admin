'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import userApi from '@/services/api/modules/user-api'
import { useModal } from '@/store/use-modal-store'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import { toast } from 'sonner'

interface AlertModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  loading: boolean
}

export const DeleteUserModal = () => {
  const { isOpen, onClose, type, data } = useModal()
  const router = useRouter()

  const isModalOpen = isOpen && type === 'deleteUser'
  const [isLoading, setLoading] = useState(false)

  const { user } = data

  const onClick = async () => {
    try {
      if (!user) return

      setLoading(true)
      const { response, error } = await userApi.removeUser(user.id)

      if (error) {
        toast.error('문제가 발생했습니다.')
        return
      }

      toast.success(response?.message ?? '사용자를 성공적으로 삭제했습니다')
      onClose()
      router.refresh()
    } catch (error) {
      toast.error('문제가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">
            사용자 삭제
          </DialogTitle>
          <DialogDescription className="text-center">
            정말로 이 작업을 하시겠습니까?? <br />
            <span className="font-semibold text-indigo-500">
              #{user?.name}
            </span>{' '}
            영구적으로 삭제됩니다.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="px-6 py-4">
          <div className="flex w-full items-center justify-between">
            <Button disabled={isLoading} onClick={onClose} variant="ghost">
              취소
            </Button>
            <Button disabled={isLoading} onClick={onClick}>
              확인하다
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
