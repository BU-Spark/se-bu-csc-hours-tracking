'use client'
import React from 'react'
import { SignInButton } from '@clerk/nextjs';
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

function Login() {
  return (
    <Container>
      <div style={{ marginLeft: "-15em" }}>
        <Title>Boston University Community Service Time Log</Title>
        <SignInButton mode="modal">
          <StyledSignInButton>
            Sign in
          </StyledSignInButton>
        </SignInButton>
      </div>
    </Container>
  );
}

export default Login;
