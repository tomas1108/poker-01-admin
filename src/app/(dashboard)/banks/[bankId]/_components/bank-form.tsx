'use client'

import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
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
import { Separator } from '@/components/ui/separator'
import { useCurrentUser } from '@/hooks/use-current-user'
import { BankSchema } from '@/schemas'
import bankApi from '@/services/api/modules/bank-api'
import { useModal } from '@/store/use-modal-store'
import { Bank } from '@/types'
import { getStorageToken, saveStorageToken } from '@/utils/storage'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trash } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useEffect, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

type BankFormProps = {
  initialData: Bank
}

export const BankForm = ({ initialData }: BankFormProps) => {
  const user = useCurrentUser()
  const { onOpen } = useModal()

  const [isPending, startTransition] = useTransition()

  const title = initialData ? '은행 수정' : '은행 만들기'
  const description = initialData ? '은행을 편집합니다.' : '새 은행 추가'
  const toastMessage = initialData
    ? '은행이 업데이트되었습니다.'
    : '사용자가 생성됨.'
  const action = initialData ? '변경사항 저장' : '만들다'

  const form = useForm({
    resolver: zodResolver(BankSchema),
    defaultValues: {
      cardNumber: '',
      securityCode: '',
      cardHolderName: '',
      expiryDate: '',
    },
  })

  const { data: session } = useSession()
  const accessToken = getStorageToken()

  useEffect(() => {
    if (!accessToken) {
      saveStorageToken(session?.user.token as string)
    }
  }, [ accessToken, session])

  useEffect(() => {
    if (initialData) {
      form.setValue('cardNumber', initialData?.cardNumber || '')
      form.setValue('securityCode', initialData?.securityCode || '')
      form.setValue('cardHolderName', initialData?.cardHolderName || '')
      form.setValue('expiryDate', initialData?.expiryDate.toString() || '')
    }
  }, [initialData, form])

  const onSubmit = async (values: z.infer<typeof BankSchema>) => {
    if (!user) return

    startTransition(async () => {
      if (!initialData) {
        const { response, error } = await bankApi.create({
          ...values,
          expiryDate: new Date(values.expiryDate),
          userId: user?.id as string,
        })

        if (error) {
          toast.error('문제가 발생했습니다.!')
          return
        }

        toast.success(toastMessage)
      } else {
        const { response, error } = await bankApi.update(
          {
            ...values,
            expiryDate: new Date(values.expiryDate),
          },
          initialData?.id
        )

        if (error) {
          toast.error('문제가 발생했습니다.!')
          return
        }

        toast.success(toastMessage)
      }
    })
  }
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={isPending}
            variant="destructive"
            size="sm"
            onClick={() =>
              onOpen('deleteBank', {
                bankId: initialData.id,
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
          className="w-full space-y-8"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="gap-8 md:grid md:grid-cols-3">
            <FormField
              control={form.control}
              name="cardNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>카드번호</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="카드번호를 입력하세요"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="securityCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>보안 코드</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="보안 코드를 입력하세요"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cardHolderName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>카드 소지자 이름</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="카드 소유자 이름을 입력하세요."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expiryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>만료일</FormLabel>
                  <FormControl>
                    <DatePicker
                      className="w-full"
                      date={new Date(field.value ? field.value : new Date())}
                      setDate={date => field.onChange(date?.toString())}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button disabled={isPending} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  )
}
