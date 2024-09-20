"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import StepOne from "../../components/Onboarding/StepOne";
import StepTwo from "../../components/Onboarding/StepTwo";
import StepThree from "../../components/Onboarding/StepThree";
import StepFour from "../../components/Onboarding/StepFour";

const OnboardingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const StepContainer = styled.div`
  margin: 20px 0;
`;

const StyledButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  background-color: #cc0000;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #990000;
  }
`;

const Onboarding: React.FC = () => {
  const [step, setStep] = useState(1);
  const router = useRouter();

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      router.push("/user/settings");
    }
  };

  return (
    <OnboardingContainer>
      <StepContainer>
        {step === 1 && <StepOne />}
        {step === 2 && <StepTwo />}
        {step === 3 && <StepThree />}
        {step === 4 && <StepFour />}
      </StepContainer>
      <StyledButton onClick={handleNext}>
        {step < 4 ? "Next" : "Get Started"}
      </StyledButton>
    </OnboardingContainer>
  );
};

export default Onboarding;