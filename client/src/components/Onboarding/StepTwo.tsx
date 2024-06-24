"use client";

import React from "react";
import styled from "styled-components";

const StepContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const Title = styled.h2`
  color: #cc0000;
`;

const Description = styled.p`
  margin-top: 1em;
  font-size: 1.1em;
  line-height: 1.5;
`;

const StepTwo: React.FC = () => {
  return (
    <StepContainer>
      <Title>Register for Events</Title>
      <Description>
        After setting up your profile, you can browse and register for events.
        Head over to the Events page to see a list of upcoming events.
      </Description>
    </StepContainer>
  );
};

export default StepTwo;
