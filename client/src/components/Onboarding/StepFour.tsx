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

const StepFour: React.FC = () => {
  return (
    <StepContainer>
      <Title>Submit Your Hours</Title>
      <Description>
        After attending the event, go to the &ldquo;Log Hours&rdquo; page to submit the
        hours you volunteered. Your submission will be reviewed and approved by
        an administrator.
      </Description>
    </StepContainer>
  );
};

export default StepFour;
