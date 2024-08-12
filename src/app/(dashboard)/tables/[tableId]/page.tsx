'use client'

import tableApi from '@/services/api/modules/table-api'
import { Table } from '@/types'
import { useCallback, useEffect, useState } from 'react'

import Loading from '../loading'
import { TableForm } from './_components/table-form'

type Props = {
  params: {
    tableId: string
  }
}

const TablePage = ({ params }: Props) => {
  const { tableId } = params
  const [initTable, setInitTable] = useState<Table | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTableDetail = useCallback(async () => {
    setLoading(true)
    setError(null) // Reset error state before fetching
    try {
      const { response: table } = await tableApi.getTableById({
        tableId: tableId,
      })

      if (!table) {
        setError('Table not found')
        setInitTable(null)
        return
      }

      const formattedTable = {
        ...table,
        minBuyIn: table.minBuyIn?.toString() ?? '',
        ante: table.ante?.toString() ?? '',
      }
      setInitTable(formattedTable)
    } catch (err) {
      setError('Failed to fetch table details')
    } finally {
      setLoading(false)
    }
  }, [tableId])

  useEffect(() => {
    if (tableId !== 'new') {
      fetchTableDetail()
    }
  }, [tableId, fetchTableDetail])

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <TableForm initialData={initTable} />
      </div>
    </div>
  )
}

export default TablePage
