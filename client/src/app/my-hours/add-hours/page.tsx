"use client";

import React, { useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { AiOutlineArrowLeft } from 'react-icons/ai';

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

const TextArea = styled.textarea`
  ${CommonInputStyle}
  resize: none;
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

const AddHours: React.FC = () => {
  const [event, setEvent] = useState('');
  const [hours, setHours] = useState('');
  const [feedback, setFeedback] = useState('');
  const [description, setDescription] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const editorId = null; // or the ID of the editor if available
    try {
      const response = await fetch('/api/add-hours', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ event, hours, feedback, description, editorId }),
      });
      if (response.ok) {
        router.push('/my-hours');
      } else {
        console.error('Failed to log hours');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <FormContainer>
      <BackButton onClick={() => router.push('/my-hours')}>
        <AiOutlineArrowLeft size={24} />
        <span>Back to Hours</span>
      </BackButton>
      <h1>Add Hours</h1>
      <form onSubmit={handleSubmit}>
        <Label>
          Event
          <Input
            type="text"
            value={event}
            onChange={(e) => setEvent(e.target.value)}
          />
        </Label>
        <Label>
          Hours
          <Input
            type="number"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
          />
        </Label>
        <Label>
          Feedback
          <TextArea
            rows={5}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </Label>
        <Label>
          Description of work done
          <TextArea
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Label>
        <SubmitButton type="submit">Submit</SubmitButton>
      </form>
    </FormContainer>
  );
};

export default AddHours;
