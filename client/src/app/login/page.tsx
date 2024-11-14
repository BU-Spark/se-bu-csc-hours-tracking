'use client'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'  // Changed from next/router
import { OAuthStrategy } from '@clerk/types'
import { useSignIn, useSignUp, useUser } from '@clerk/nextjs'
import styled from 'styled-components';
import { buRed } from "../../_common/styles";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
  background-color: white;
`;

const Title = styled.h1`
  color: ${buRed};
  margin-bottom: 20px;
`;

const StyledSignInButton = styled.button`
  background-color: black;
  color: white;
  border: 2px solid ${buRed};
  padding: 10px 20px;
  font-weight: bold;
  cursor: pointer;
  border-radius: 30px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${buRed};
  }
`;

export default function Login() {
  console.log('Initializing Login component')
  const router = useRouter()  // Enable router
  const { signIn } = useSignIn()
  const { signUp, setActive } = useSignUp()
  const { user, isSignedIn, isLoaded } = useUser()  // Enable user check
  // useEffect(() => {
  //   console.log('Checking if user is signed in')
  //   if (isLoaded && isSignedIn) {
  //     router.push('/auth/sso-callback')
  //   }
  //   console.log('User signed in:', isSignedIn), 
  //   console.log('User loaded: ', isLoaded)
  // }, [isLoaded, isSignedIn, router])

  if (!signIn || !signUp) {
    console.log('SignIn or SignUp not available')
    return (
      <Container>
        <Title>Loading...</Title>
      </Container>
    )
  }

  const signInWith = async (strategy: OAuthStrategy) => {
    console.log(`Attempting to sign in with strategy: ${strategy}`)
    try {
      await signIn.authenticateWithRedirect({
        strategy,
        redirectUrl: '/sign-up/sso-callback',
        redirectUrlComplete: '/auth/sso-callback',
      })
    } catch (error) {
      console.error('Authentication redirect failed:', error)
    }
  }

  async function handleSignIn(strategy: OAuthStrategy) {
    console.log('handleSignIn called with strategy:', strategy)

    if (!signIn || !signUp) {
      console.log('SignIn or SignUp not available in handleSignIn')
      return
    }

    const userNeedsToBeCreated = signIn.firstFactorVerification.status === 'transferable'
    console.log('User needs to be created:', userNeedsToBeCreated)

    if (isSignedIn) {
      console.log('User is already signed in')
      router.push('/auth/sso-callback')
      return
    }

    if (userNeedsToBeCreated) {
      console.log('Attempting to create new user account')
      try {
        const res = await signUp.create({
          transfer: true,
        })
        console.log('User creation response:', res)

        const email = res.emailAddress
        console.log('User signed in with email:', email)

        if (res.status === 'complete') {
          console.log('Setting active session with ID:', res.createdSessionId)
          await setActive({
            session: res.createdSessionId,
          })

        // Create a new entry in the database
        const databaseRes = await fetch('/api/create-new-person', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        })
          .then(response => {
            if (response.ok) {
              console.log('User entry created in database successfully')
            } else {
              console.error('Failed to create user entry in database')
            }
          })
          .catch(error => {
            console.error('Error creating user entry:', error)
          })

          router.push('/welcome') 
        }

      } catch (error) {
        console.error('Error creating user:', error)
      }
    } else {

      console.log('User exists, proceeding with normal sign in')
      signInWith(strategy)
    }
  }

  console.log('Rendering login component')
  return (
    <Container>
      <div style={{ marginLeft: "-15em" }}>
        <Title>Boston University Community Service Time Log</Title>
        <StyledSignInButton onClick={() => handleSignIn('oauth_google')}>
          Sign in / Sign up with Google
        </StyledSignInButton>
      </div>
    </Container>
  )
}