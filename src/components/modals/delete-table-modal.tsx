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
import tableApi from '@/services/api/modules/table-api'
import userApi from '@/services/api/modules/user-api'
import { useModal } from '@/store/use-modal-store'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import { toast } from 'sonner'

export const DeleteTableModal = () => {
  const { isOpen, onClose, type, data } = useModal()
  const router = useRouter()

  const isModalOpen = isOpen && type === 'deleteTable'
  const [isLoading, setLoading] = useState(false)

  const { table } = data

  const onClick = async () => {
    try {
      if (!table) return

      setLoading(true)
      const { response, error } = await tableApi.delete(table.id)

      if (error) {
        toast.error('문제가 발생했습니다.')
        return
      }

      toast.success('테이블이 삭제되었습니다!')
      onClose()
      router.push(`/tables`)
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
            테이블 삭제
          </DialogTitle>
          <DialogDescription className="text-center">
            정말로 이 작업을 하시겠습니까?? <br />
            <span className="font-semibold text-indigo-500">
              #{table?.name}
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
