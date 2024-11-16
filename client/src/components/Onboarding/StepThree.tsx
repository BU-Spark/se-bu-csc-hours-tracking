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

const StepThree: React.FC = () => {
  return (
    <StepContainer>
      <Title>Agree to Event Terms</Title>
      <Description>
        Once you&apos;ve found an event you&apos;d like to attend, click on it to see the
        details. Make sure to read and agree to the event terms before
        registering.
      </Description>
    </StepContainer>
  );
};

export default StepThree;
