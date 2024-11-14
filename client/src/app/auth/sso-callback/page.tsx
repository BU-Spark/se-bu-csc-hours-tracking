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
    console.log('SSO Callback: Component mounted', { isLoaded, isSignedIn });
    if (!isLoaded) return

    // pause for 5 seconds
    const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

    if (!isSignedIn) {
      console.log('User not signed in, redirecting to login');
      const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
      router.replace('/login')
      return
    }

    const fetchAndRedirect = async () => {
      console.log('Starting fetchAndRedirect...');
      try {
        if (!session?.user?.id) {
          console.error('No user ID available');
          throw new Error('No user ID available')
        }

        console.log('Fetching person data for user in sso-callback:', session.user.id);
        const person = await getPersonFromUser(session.user.id)
        console.log('Person data received:', person);
        
        if (!person || !person.role) {
          console.error('Invalid person data:', person);
          throw new Error('Person data not available')
        }

        console.log('Redirecting based on role:', person.role);
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
        console.error('Error in fetchAndRedirect:', error)
        router.push('/error')
      }
    }

    fetchAndRedirect()
  }, [isLoaded, isSignedIn, router, session])

  return <div>Loading...</div>
}
