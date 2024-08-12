'use client'

import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { getStorageToken, saveStorageToken } from '@/utils/storage'
import { Plus } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { TableColumn, columns } from './columns'

interface TablesClientProps {
  data: TableColumn[]
}

export const TablesClient: React.FC<TablesClientProps> = ({ data }) => {
  const router = useRouter()
  const { data: session } = useSession()
  const accessToken = getStorageToken()

  useEffect(() => {
    if (!accessToken) {
      saveStorageToken(session?.user.token as string)
    }
  }, [])

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`테이블 (${data.length})`} description="테이블 관리" />
        <Button onClick={() => router.push(`/tables/new`)}>
          <Plus className="mr-2 h-4 w-4" /> 새로 추가
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
    </>
  )
}
