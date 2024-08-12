'use client'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Heading } from '@/components/ui/heading'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useCurrentUser } from '@/hooks/use-current-user'
import { UserSchema } from '@/schemas'
import userApi from '@/services/api/modules/user-api'
import { useModal } from '@/store/use-modal-store'
import { User } from '@/types'
import { getStorageToken, saveStorageToken } from '@/utils/storage'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { Trash } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

import { ImageOption } from './image-options'

type UserFormProps = {
  initialData: User | null
}

export const UserForm = ({ initialData }: UserFormProps) => {
  const { onOpen } = useModal()

  const router = useRouter()
  const user = useCurrentUser()
  const { update } = useSession()

  const [loading, setLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    initialData?.image
  )

  const title = initialData ? '사용자 편집' : '사용자 생성'
  const description = initialData ? '사용자를 편집합니다' : '새 사용자 추가'
  const toastMessage = initialData
    ? '사용자가 업데이트되었습니다.'
    : '사용자가 생성되었습니다.'
  const action = initialData ? '변경사항 저장' : '만들다'

  const form = useForm<z.infer<typeof UserSchema>>({
    resolver: zodResolver(UserSchema),
    defaultValues: initialData || {
      username: '',
      email: '',
      name: '',
      image: '',
      role: '',
    },
  })

  const { data: session } = useSession()
  const accessToken = getStorageToken()

  useEffect(() => {
    if (!accessToken) {
      saveStorageToken(session?.user.token as string)
    }
  }, [])

  const onSubmit = async (values: z.infer<typeof UserSchema>) => {
    try {
      setLoading(true)

      const { response, error } = await userApi.updateAll(
        values,
        initialData?.id as string
      )

      if (error) {
        toast.error('문제가 발생했습니다..')
        return
      }

      if (initialData?.id === user?.id) {
        update()
      }

      router.refresh()
      router.push(`/users/list`)
      toast.success(toastMessage)
    } catch (error: any) {
      toast.error('문제가 발생했습니다..')
    } finally {
      setLoading(false)
    }
  }

  function handleImageClick(index: number) {
    const imageUrl = `/images/avt/${index + 1}.jpg`
    setSelectedImage(imageUrl)
    form.setValue('image', imageUrl)
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() =>
              onOpen('deleteUser', {
                user: {
                  id: initialData.id,
                  name: initialData.name,
                  username: initialData.username,
                  email: initialData.email,
                  role: initialData.role,
                  chipsAmount: initialData.chipsAmount.toString(),
                  createdAt: initialData.createdAt,
                },
              })
            }
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <div className="gap-8 md:grid md:grid-cols-3">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>사용자 이름</FormLabel>
                  <FormControl>
                    <Input
                      disabled={true}
                      placeholder="사용자 이름"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이름</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-x-4">
                      <Input disabled={loading} {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이메일</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      disabled={true}
                      placeholder="sonwin@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>역할</FormLabel>
                  <FormControl>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="역할" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ADMIN">관리자</SelectItem>
                        <SelectItem value="USER">사용자</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 10 }).map((_, index) => (
                <div
                  key={index}
                  className={`${selectedImage === `/images/avt/${index + 1}.jpg` && 'rounded-full border border-primary brightness-125'}`}
                >
                  <ImageOption
                    index={index}
                    onClick={() => handleImageClick(index)}
                    imageUrl={`/images/avt/${index + 1}.jpg`}
                  />
                </div>
              ))}
            </div>
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  )
}
