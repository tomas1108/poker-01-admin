'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useModal } from '@/store/use-modal-store'
import { Copy, Edit, MoreHorizontal, Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { RechargeColumn } from './columns'

interface CellActionProps {
  data: RechargeColumn
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const { onOpen } = useModal()
  const router = useRouter()

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id)
    toast.success('Recharge ID copied to clipboard.')
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">메뉴 열기</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>행위</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <Copy className="mr-2 h-4 w-4" /> 신분증 복사
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/recharges/${data.id}`)}
          >
            <Edit className="mr-2 h-4 w-4" /> 업데이트
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onOpen('deleteRecharge', { rechargeId: data.id })}
          >
            <Trash className="mr-2 h-4 w-4" /> 삭제
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
