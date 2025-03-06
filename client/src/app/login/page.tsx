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
  const router = useRouter()
  const { signIn } = useSignIn()
  const { signUp, setActive } = useSignUp()
  const { user, isSignedIn, isLoaded } = useUser()

  if (!signIn || !signUp) {
    return (
      <Container>
        <Title>Loading...</Title>
      </Container>
    )
  }

  const signInWith = async (strategy: OAuthStrategy) => {
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
    if (!signIn || !signUp) return

    const userNeedsToBeCreated = signIn.firstFactorVerification.status === 'transferable'

    if (isSignedIn) {
      router.push('/auth/sso-callback')
      return
    }

    if (userNeedsToBeCreated) {
      try {
        const res = await signUp.create({ transfer: true })
        const email = res.emailAddress

        if (res.status === 'complete') {
          await setActive({ session: res.createdSessionId })

          await fetch('/api/create-new-person', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
          })

          router.push('/welcome') 
        }
      } catch (error) {
        console.error('Error creating user:', error)
      }
    } else {
      signInWith(strategy)
    }
  }

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