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
    header: 'Name',
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
    header: 'Chips 양',
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
]
