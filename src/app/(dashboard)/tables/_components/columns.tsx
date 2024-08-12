'use client'

import { ColumnDef } from '@tanstack/react-table'

import { CellAction } from './cell-action'

export type TableColumn = {
  id: string
  name: string
  owner: string
  min: string
  max: string
  ante: string
}

export const columns: ColumnDef<TableColumn>[] = [
  {
    accessorKey: 'name',
    header: '이름',
  },
  {
    accessorKey: 'owner',
    header: '소유자',
  },
  {
    accessorKey: 'ante',
    header: '앤티',
  },
  {
    accessorKey: 'min',
    header: '최소 바이인',
  },
  {
    accessorKey: 'max',
    header: '최대 바이인',
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
]
