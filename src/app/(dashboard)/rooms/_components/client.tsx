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

interface RoomsClientProps {
  data?: TableColumn[]
}

export const RoomsClient: React.FC<RoomsClientProps> = ({ data }) => {
  const router = useRouter()

  const { data: session } = useSession()
  const accessToken = getStorageToken()

  useEffect(() => {
    if (!accessToken) {
      saveStorageToken(session?.user.token as string)
    }
  }, [  accessToken, session ])

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`객실`} description="회의실 관리" />
        {/* <Button onClick={() => router.push(`/rooms/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button> */}
      </div>
      <Separator />
      <div className="items-cemter flex flex-1 justify-center">
        <h2 className="text-3xl font-bold tracking-tight">곧 출시 예정</h2>
      </div>
      {/* <DataTable searchKey="name" columns={columns} data={data} /> */}
    </>
  )
}
