'use client'

import { Table } from '@/types'
import { ColumnDef } from '@tanstack/react-table'

export type HistoryColumn = {
  id: string
  table: Table
  username: string
  content: string
  amount: number
  createdAt: Date
}

export const columns: ColumnDef<HistoryColumn>[] = [
  {
    accessorKey: 'table',
    header: '테이블 이름',
  },
  {
    accessorKey: 'username',
    header: '사용자 이름',
  },
  {
    accessorKey: 'content',
    header: '경기 결과',
  },
  {
    accessorKey: 'amount',
    header: '양',
  },
  {
    accessorKey: 'type',
    header: '유형',
  },
  {
    accessorKey: 'createdAt',
    header: '날짜',
  },
]
