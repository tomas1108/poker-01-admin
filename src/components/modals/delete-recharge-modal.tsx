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
import rechargeApi from '@/services/api/modules/recharge-api'
import { useModal } from '@/store/use-modal-store'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export const DeleteRechargeModal = () => {
  const { isOpen, onClose, type, data } = useModal()
  const router = useRouter()

  const isModalOpen = isOpen && type === 'deleteRecharge'
  const [isLoading, setLoading] = useState(false)

  const { rechargeId } = data

  const onClick = async () => {
    try {
      if (!rechargeId) return

      setLoading(true)
      const { response, error } = await rechargeApi.delete(rechargeId)

      if (error) {
        toast.error('문제가 발생했습니다.')
        return
      }

      toast.success('충전이 삭제되었습니다.!')
      onClose()
      router.push(`/recharges`)
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
            충전 삭제
          </DialogTitle>
          <DialogDescription className="text-center">
            정말로 이 작업을 하시겠습니까?? <br />
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
