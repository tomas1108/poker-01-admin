'use client'

import { ColumnDef } from '@tanstack/react-table'

import { CellAction } from './cell-action'

export type WithdrawColumn = {
  id: string
  username: string
  cardNumber: string
  cardHolderName: string
  amount: string
  status: string
}

export const columns: ColumnDef<WithdrawColumn>[] = [
  {
    accessorKey: 'username',
    header: '사용자 이름',
  },
  {
    accessorKey: 'cardNumber',
    header: '카드번호',
  },
  {
    accessorKey: 'cardHolderName',
    header: '카드 소지자 이름',
  },
  {
    accessorKey: 'amount',
    header: '양',
  },
  {
    accessorKey: 'status',
    header: '상태',
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
]
