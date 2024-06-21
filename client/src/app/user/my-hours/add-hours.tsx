"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import { getAllApprovedEventsByUserId } from "./add-hours/action";

const FormContainer = styled.div`
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  margin-bottom: 10px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
`;

const TextArea = styled.textarea`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  width: 100%;
  resize: none;
  box-sizing: border-box;
`;

const SubmitButton = styled.button`
  padding: 10px;
  border: none;
  border-radius: 8px;
  background-color: #ff0000;
  color: #fff;
  cursor: pointer;
  font-size: 1rem;
  &:hover {
    background-color: #cc0000;
  }
`;

const LogHours: React.FC = () => {
  const [event, setEvent] = useState("");
  const [hours, setHours] = useState("");
  const [feedback, setFeedback] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/add-hours", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ event, hours, feedback, description }),
      });
      if (response.ok) {
        router.push("/my-hours");
      } else {
        console.error("Failed to log hours:", await response.json());
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <FormContainer>
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

export default LogHours;
