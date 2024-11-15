// pages/user.tsx
'use client'
import { useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { getPersonFromUser } from '@/lib/getPersonFromUser'
import { useSession } from '@clerk/nextjs'

export default function UserPage() {
  const { isLoaded, isSignedIn } = useUser()
  const router = useRouter()
  const { session } = useSession()

  useEffect(() => {
    if (!isLoaded) return

    if (!isSignedIn) {
      router.replace('/login')
      return
    }

    const fetchAndRedirect = async () => {
      try {
        if (!session?.user?.id) {
          throw new Error('No user ID available')
        }

        const person = await getPersonFromUser(session.user.id)
        
        if (!person || !person.role) {
          throw new Error('Person data not available')
        }

        switch (person.role) {
          case 'USER':
            router.push('/user/my-hours')
            break
          case 'ADMIN':
            router.push('/admin/dashboard')
            break
          case 'ORGANIZER':
            router.push('/third-party/dashboard')
            break
          default:
            throw new Error('Invalid role')
        }
      } catch (error) {
        router.push('/error')
      }
    }

    fetchAndRedirect()
  }, [isLoaded, isSignedIn, router, session])

  return <div>Loading...</div>
}
