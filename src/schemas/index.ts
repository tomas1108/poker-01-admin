// import { ChannelType, CleaningDelay, Statuses } from '@prisma/client'
import * as z from 'zod'

export const LoginSchema = z.object({
  username: z.string().min(1, { message: '사용자 이름 필수' }),
  password: z.string().min(1, { message: '비밀번호 필수' }),
  code: z.optional(z.string()),
})

export const RegisterSchema = z.object({
  username: z.string().min(6, { message: '최소 6자 이상 필요' }),
  email: z.string().email({ message: '이메일 필수' }),
  password: z.string().min(6, { message: '최소 6자 이상 필요' }),
})

export const ChatItemSchema = z.object({
  content: z.string().min(1),
})

export const UserSchema = z.object({
  username: z.string().min(1, { message: '사용자 이름 필수' }),
  email: z.string().email({ message: '이메일 필수' }),
  name: z.string().min(1, { message: '사용자 이름 필수' }),
  image: z.string().min(1, { message: '사용자 이미지 필수' }),
  role: z.string().min(1, { message: '사용자 역할 필수' }),
})

export const TableSchema = z
  .object({
    name: z.string().min(1, { message: '테이블 이름 필수' }),
    minBuyIn: z
      .string()
      .min(1, { message: '최소 바이인 필수' })
      .refine(value => !isNaN(Number(value)), {
        message: '최소 구매는 숫자여야 합니다.',
      }),
    maxBuyIn: z
      .string()
      .min(1, { message: '최대 바이인 필수' })
      .refine(value => !isNaN(Number(value)), {
        message: '최대 바이인은 숫자여야 합니다.',
      }),
    ante: z
      .string()
      .min(1, { message: '앤티 필수' })
      .refine(value => !isNaN(Number(value)), {
        message: '앤티는 숫자여야 합니다.',
      }),
    chatBanned: z.boolean(),
  })
  .refine(data => Number(data.minBuyIn) >= Number(data.ante), {
    message: '앤티는 최소 바이인보다 작거나 같아야 합니다.',
  })

export const NewPasswordSchema = z
  .object({
    password: z.string().min(6, {
      message: '최소 6자 필수',
    }),
    newPassword: z.string().min(6, {
      message: '최소 6자 필수',
    }),
    confirmNewPassword: z.string().min(6, {
      message: '최소 6자 필수',
    }),
  })
  .refine(data => data.newPassword === data.confirmNewPassword, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['confirmNewPassword'],
  })

export const CardActionSchema = z.object({
  amount: z.number().min(1, { message: '양 필수' }),
  type: z.string().min(1, { message: '유형 필수' }),
})

export const BankSchema = z.object({
  cardNumber: z
    .string()
    .min(1, { message: '카드번호 필수' })
    .regex(/^[0-9]+$/, { message: '카드 번호는 숫자여야 합니다.' }),
  securityCode: z.string().min(1, { message: '보안 코드 필수' }),
  cardHolderName: z
    .string()
    .min(1, { message: '카드 소지자 이름 필수' }),
  expiryDate: z.string().min(1, { message: '만료일 필수' }),
})

export const RechargeSchema = z.object({
  amount: z
    .string()
    .min(1, { message: '양 필수' })
    .regex(/^[0-9]+$/, { message: '카드 번호는 숫자여야 합니다.' }),
  status: z.string().min(1, { message: '상태 필수' }),
})

export const WithdrawSchema = z.object({
  amount: z
    .string()
    .min(1, { message: '양 필수' })
    .regex(/^[0-9]+$/, { message: '카드 번호는 숫자여야 합니다.' }),
  status: z.string().min(1, { message: '상태 필수' }),
})
