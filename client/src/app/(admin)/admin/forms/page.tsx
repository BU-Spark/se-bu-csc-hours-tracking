"use client";
import React from "react";
import StyledButton from "@/components/StyledButton";

const Forms: React.FC = () => {
  return (
    <div>
      <StyledButton
        text="+ Add Form"
        selected={true}
        onClick={() => {
          console.log("log");
        }}
      />
    </div>
  );
};

export default Forms;
