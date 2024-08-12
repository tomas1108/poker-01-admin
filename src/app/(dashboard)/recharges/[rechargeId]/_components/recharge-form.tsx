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
import { RechargeSchema } from '@/schemas'
import rechargeApi from '@/services/api/modules/recharge-api'
import { useModal } from '@/store/use-modal-store'
import { Recharge } from '@/types'
import { getStorageToken, saveStorageToken } from '@/utils/storage'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trash } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

type RechargeFormProps = {
  initialData: Recharge | null
}

export const RechargeForm = ({ initialData }: RechargeFormProps) => {
  const { onOpen } = useModal()

  const user = useCurrentUser()
  const router = useRouter()
  const { update } = useSession()

  const [loading, setLoading] = useState(false)

  const title = initialData ? '충전 수정' : '재충전 생성'
  const description = initialData ? '충전 수정.' : '새로운 충전 추가'
  const toastMessage = initialData
    ? '충전이 업데이트되었습니다.'
    : '충전이 생성되었습니다..'
  const action = initialData ? '변경사항 저장' : '만들다'

  const form = useForm<z.infer<typeof RechargeSchema>>({
    resolver: zodResolver(RechargeSchema),
    defaultValues: {
      amount: '',
      status: '',
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
      form.setValue('amount', initialData?.amount.toString() || '')
      form.setValue('status', initialData?.status || '')
    }
  }, [initialData, form])

  const onSubmit = async (values: z.infer<typeof RechargeSchema>) => {
    try {
      if (!user) return

      setLoading(true)

      const { response, error } = await rechargeApi.update(
        { ...values, amount: +values.amount },
        initialData?.id as string
      )

      if (error) {
        toast.error('문제가 발생했습니다..')
        return
      }

      router.push(`/recharges`)
      router.refresh()
      toast.success(toastMessage)
    } catch (error: any) {
      toast.error('문제가 발생했습니다..')
    } finally {
      setLoading(false)
    }
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
              onOpen('deleteRecharge', {
                rechargeId: initialData.id,
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
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>충전 이름</FormLabel>
                  <FormControl>
                    <Input disabled={true} placeholder="충전 이름" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>상태</FormLabel>
                  <FormControl>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="상태" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="성공">성공</SelectItem>
                        <SelectItem value="보류 중">보류 중</SelectItem>
                        <SelectItem value="실패한">실패한</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  )
}
