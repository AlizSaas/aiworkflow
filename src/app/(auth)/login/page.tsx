import LoginForm from '@/components/features/auth/components/login-form'
import {  requireUnauth } from '@/lib/get-session'
import React from 'react'

export default async  function Login() {
  await requireUnauth()
  return (
    <LoginForm  />
  )
}
