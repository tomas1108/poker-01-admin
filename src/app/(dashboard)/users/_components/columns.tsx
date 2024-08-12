'use client'

import { ColumnDef } from '@tanstack/react-table'

import { CellAction } from './cell-action'

export type UserColumn = {
  id: string
  username: string
  name: string
  email: string
  role: string
  chipsAmount: string
  createdAt: Date
}

export const columns: ColumnDef<UserColumn>[] = [
  {
    accessorKey: 'username',
    header: '사용자 이름',
  },
  {
    accessorKey: 'name',
    header: '이름',
  },
  {
    accessorKey: 'email',
    header: '이메일',
  },
  {
    accessorKey: 'role',
    header: '역할',
  },
  {
    accessorKey: 'chipsAmount',
    header: '칩 금액',
  },
  {
    accessorKey: 'createdAt',
    header: '날짜',
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
]
