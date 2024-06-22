"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useSession } from "next-auth/react";
import {
  createNewHourSubmission,
  getAllApprovedEventsByUserId,
} from "./action";
import { CreateNewHourSubmissionParams } from "@/interfaces/interfaces";
import { Event } from "@prisma/client";
import { Button, InputNumber, AutoComplete } from "antd";
import { buRed } from "@/_common/styles";

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
  align-items: flex-start;
  font-size: 1rem;
  margin-bottom: 20px;
`;

const LabelTitle = styled.span`
  display: flex;
  align-items: center;
`;

const Asterisk = styled.span`
  color: red;
  margin-left: 5px;
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

const StyledInputNumber = styled(InputNumber)`
  ${CommonInputStyle}
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
  const [event, setEvent] = useState<Event | null>(null);
  const [eventOptions, setEventOptions] = useState<Event[]>([]);
  const [hours, setHours] = useState<number | string>(0);
  const [feedback, setFeedback] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchValidEvents = async () => {
      if (!session?.user.id) return;
      const validEvents: Event[] | undefined =
        await getAllApprovedEventsByUserId(Number(session?.user.id));
      if (!validEvents) return;
      setEventOptions(validEvents);
    };
    fetchValidEvents();
  }, [session?.user.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;
    const body: CreateNewHourSubmissionParams = {
      eventId: Number(event.id),
      userId: Number(session?.user.id),
      hours: Number(hours),
      feedback: feedback,
      description: description,
    };
    try {
      const response = await createNewHourSubmission(body);
      if (response) {
        router.push("/my-hours");
        console.log("Success");
      } else {
        console.log("Failed to log hours");
        router.push("/my-hours");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const options = eventOptions.map((event) => ({
    value: event.title,
    label: event.title,
    event: event,
  }));

  return (
    <FormContainer>
      <BackButton onClick={() => router.push("/my-hours")}>
        <AiOutlineArrowLeft size={24} />
        <span>Back to Hours</span>
      </BackButton>
      <h1>Add Hours</h1>
      <form onSubmit={handleSubmit}>
        <Label>
          <LabelTitle>
            Event
            <Asterisk>*</Asterisk>
          </LabelTitle>
          <AutoComplete
            options={options}
            style={{ width: "100%" }}
            placeholder="Choose Event"
            onSelect={(value, option) => setEvent(option.event)}
            filterOption={(inputValue, option) =>
              option!.value.toUpperCase().includes(inputValue.toUpperCase())
            }
          />
        </Label>
        <Label>
          <LabelTitle>
            Hours
            <Asterisk>*</Asterisk>
          </LabelTitle>
          <StyledInputNumber
            defaultValue="1"
            min="0"
            max="10"
            step="0.25"
            onChange={(value) => setHours(Number(value))}
            stringMode
          />
        </Label>
        <Label>
          <LabelTitle>
            Feedback
            <Asterisk>*</Asterisk>
          </LabelTitle>
          <TextArea
            rows={5}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </Label>
        <Label>
          <LabelTitle>
            Description of work done
            <Asterisk>*</Asterisk>
          </LabelTitle>
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
