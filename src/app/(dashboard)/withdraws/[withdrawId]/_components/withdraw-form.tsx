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
import { WithdrawSchema } from '@/schemas'
import withdrawApi from '@/services/api/modules/withdraw-api'
import { useModal } from '@/store/use-modal-store'
import { Withdraw } from '@/types'
import { getStorageToken, saveStorageToken } from '@/utils/storage'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trash } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

type WithdrawFormProps = {
  initialData: Withdraw | null
}

export const WithdrawForm = ({ initialData }: WithdrawFormProps) => {
  const { onOpen } = useModal()

  const user = useCurrentUser()
  const router = useRouter()

  const [loading, setLoading] = useState(false)

  const title = initialData ? 'Edit withdraw' : '만들다 withdraw'
  const description = initialData ? 'Edit a withdraw.' : 'Add a new withdraw'
  const toastMessage = initialData ? 'Withdraw updated.' : 'Withdraw created.'
  const action = initialData ? '변경사항 저장' : '만들다'

  const form = useForm<z.infer<typeof WithdrawSchema>>({
    resolver: zodResolver(WithdrawSchema),
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
  }, [])

  useEffect(() => {
    if (initialData) {
      form.setValue('amount', initialData?.amount.toString() || '')
      form.setValue('status', initialData?.status || '')
    }
  }, [initialData, form])

  const onSubmit = async (values: z.infer<typeof WithdrawSchema>) => {
    try {
      if (!user) return

      setLoading(true)

      const { response, error } = await withdrawApi.update(
        { ...values, amount: +values.amount },
        initialData?.id as string
      )

      if (error) {
        toast.error('문제가 발생했습니다..')
        return
      }

      router.push(`/withdraws`)
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
              onOpen('deleteWithdraw', {
                withdrawId: initialData.id,
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
                  <FormLabel>Withdraw Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={true}
                      placeholder="Withdraw name"
                      {...field}
                    />
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
                        <SelectItem value="성공">Success</SelectItem>
                        <SelectItem value="보류 중">Pending</SelectItem>
                        <SelectItem value="실패한">Failed</SelectItem>
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
