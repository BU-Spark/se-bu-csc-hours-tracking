'use client'
import React from 'react'
import { OAuthStrategy } from '@clerk/types'
import { useSignIn, useSignUp } from '@clerk/nextjs'
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

export default function OauthSignIn() {
  const { signIn } = useSignIn()
  const { signUp, setActive } = useSignUp()

  if (!signIn || !signUp) return null

  const signInWith = (strategy: OAuthStrategy) => {
    return signIn.authenticateWithRedirect({
      strategy,
      redirectUrl: '/sign-up/sso-callback',
      redirectUrlComplete: '/',
    })
  }

  async function handleSignIn(strategy: OAuthStrategy) {
    if (!signIn || !signUp) return null

    // If the user has an OAuth account but does not yet
    // have an account in your app, you can create an account
    // for them using the OAuth information.
    const userNeedsToBeCreated = signIn.firstFactorVerification.status === 'transferable'

    if (userNeedsToBeCreated) {
      const res = await signUp.create({
        transfer: true,
      })

      if (res.status === 'complete') {
        setActive({
          session: res.createdSessionId,
        })
      }
    } else {
      // If the user has an account in your application
      // and has an OAuth account connected to it, you can sign them in.
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
  );
}