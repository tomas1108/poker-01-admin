'use client'

import { ColumnDef } from '@tanstack/react-table'

import { CellAction } from './cell-action'

export type BankColumn = {
  id: string
  username: string
  cardNumber: string
  cardHolderName: string
  securityCode: string
  expiryDate: Date
}

export const columns: ColumnDef<BankColumn>[] = [
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
    accessorKey: 'securityCode',
    header: '보안 코드',
  },
  {
    accessorKey: 'expiryDate',
    header: '만료일',
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
]
