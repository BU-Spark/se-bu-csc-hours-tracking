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
import { AutoComplete, Select } from "antd";
import { buRed } from "@/_common/styles";
import {
  Asterisk,
  BackButton,
  FormContainer,
  Label,
  LabelTitle,
  StyledInputNumber,
  SubmitButton,
  TextArea,
} from "@/_common/styledDivs";
const { Option } = Select;

const AddHours: React.FC = () => {
  const [event, setEvent] = useState<Event | null>(null);
  const [eventOptions, setEventOptions] = useState<Event[]>([]);
  const [hours, setHours] = useState<number | string>();
  const [feedback, setFeedback] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (event && hours && feedback && description) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [event, hours, feedback, description]);

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
      eventId: Number(event),
      userId: Number(session?.user.id),
      hours: Number(hours),
      feedback: feedback,
      description: description,
    };
    try {
      const response = await createNewHourSubmission(body);
      if (response) {
        router.push("/user/my-hours");
        console.log("Success");
      } else {
        console.log("Failed to log hours");
        router.push("/user/my-hours");
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
      <BackButton onClick={() => router.push("/user/my-hours")}>
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
          <Select
            style={{ width: "100%" }}
            placeholder="Choose Event"
            onChange={(value) => setEvent(value)}
          >
            {options.map((option) => (
              <Option key={option.value} value={option.event.id}>
                {option.label.toString()}
              </Option>
            ))}
          </Select>
        </Label>
        {/* <Label>
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
        </Label> */}
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
        <div
          style={{
            opacity: isFormValid ? "100%" : "40%",
          }}
        >
          {" "}
          <SubmitButton type="submit" disabled={isFormValid ? false : true}>
            Submit
          </SubmitButton>
        </div>
      </form>
    </FormContainer>
  );
};

export default AddHours;
