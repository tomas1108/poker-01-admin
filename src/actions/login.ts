'use server'

import { signIn } from '@/auth'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import { LoginSchema } from '@/schemas'
import { AuthError } from 'next-auth'
import * as z from 'zod'

export const login = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null
) => {
  const validatedFields = LoginSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: '잘못된 필드!' }
  }

  const { username, password } = validatedFields.data

  try {
    await signIn('credentials', {
      username,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: '잘못된 자격 증명' }
        default:
          return { error: '문제가 발생했습니다.!' }
      }
    }

    throw error
  }

  return { success: 'User created sucessfully!' }
}

// export const login = async (
//   values: z.infer<typeof LoginSchema>,
// ) => {
//   const validatedFields = LoginSchema.safeParse(values);

//   if (!validatedFields.success) {
//     return { error: 'Invalid fields!' }
//   }

//   const { username, password } = validatedFields.data;

//   const auth = await userApi.login({ username, password });
  
//   return auth;
// }
