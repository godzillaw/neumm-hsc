'use client'
import { useEffect } from 'react'

// Sign-in is handled through the signup flow.
// Redirect anyone who lands here to signup.
export default function LoginPage() {
  useEffect(() => {
    window.location.replace('/math-nsw/app/auth/signup')
  }, [])
  return null
}
