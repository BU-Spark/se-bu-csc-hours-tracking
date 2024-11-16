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

const StepOne: React.FC = () => {
  return (
    <StepContainer>
      <Title>Welcome to BU Community Service Time Log!</Title>
      <Description>
        We are excited to have you here. Let&apos;s start by setting up your profile.
        Please provide your phone number, college, class year, and any dietary
        restrictions.
      </Description>
    </StepContainer>
  );
};

export default StepOne;
