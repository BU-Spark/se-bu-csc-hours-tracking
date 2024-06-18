"use client";

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { checkIfNewUser, updateUserDetails } from './action';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const FormContainer = styled.div`
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  border-radius: 8px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const BackButton = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: 20px;
  color: #cc0000;

  &:hover {
    color: #ff0000;
  }

  svg {
    margin-right: 8px;
  }
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  margin-bottom: 20px;
`;

const CommonInputStyle = `
  padding: 10px;
  border-radius: 8px;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
  margin-top: 8px;
  border: 1px solid #ccc;
  font-family: inherit;
`;

const Input = styled.input`
  ${CommonInputStyle}
`;

const SubmitButton = styled.button`
  padding: 10px;
  border: none;
  border-radius: 8px;
  background-color: rgba(204, 0, 0, 1);
  color: #fff;
  cursor: pointer;
  font-size: 1rem;
  &:hover {
    background-color: rgba(153, 0, 0, 1);
  }
`;

const Settings: React.FC = () => {
  const { status } = useSession();
  const router = useRouter();
  const [isNewUser, setIsNewUser] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [college, setCollege] = useState<string>('');
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string>('');

  useEffect(() => {
    if (status === "authenticated") {
      const fetchUserStatus = async () => {
        const status = await checkIfNewUser();
        if (!status.isNewUser) {
          router.push('/dashboard');
        } else {
          setIsNewUser(true);
        }
      };

      fetchUserStatus();
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUserDetails({ phone_number: phoneNumber, college, dietary_restrictions: dietaryRestrictions });
      router.push('/dashboard');
    } catch (error) {
      console.error("Error updating user details:", error);
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!isNewUser) {
    return null;
  }

  return (
    <FormContainer>
      <BackButton onClick={() => router.push('/dashboard')}>
        <span>Back to Dashboard</span>
      </BackButton>
      <h1>Settings</h1>
      <form onSubmit={handleSubmit}>
        <Label>
          Phone Number
          <Input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </Label>
        <Label>
          College
          <Input
            type="text"
            value={college}
            onChange={(e) => setCollege(e.target.value)}
          />
        </Label>
        <Label>
          Dietary Restrictions
          <Input
            type="text"
            value={dietaryRestrictions}
            onChange={(e) => setDietaryRestrictions(e.target.value)}
          />
        </Label>
        <SubmitButton type="submit">Submit</SubmitButton>
      </form>
    </FormContainer>
  );
};

export default Settings;
