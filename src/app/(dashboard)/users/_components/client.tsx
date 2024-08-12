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

import { UserColumn, columns } from './columns'

interface UsersClientProps {
  data: UserColumn[]
}

export const UsersClient: React.FC<UsersClientProps> = ({ data }) => {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const accessToken = getStorageToken()

  useEffect(() => {
    if (!accessToken) {
      saveStorageToken(session?.user.token as string)
    }
  }, [ accessToken, session ])

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`사용자 (${data.length})`} description="사용자 관리" />
        {/* <Button onClick={() => router.push(`/users/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button> */}
      </div>
      <Separator />
      <DataTable searchKey="username" columns={columns} data={data} />
    </>
  )
}
