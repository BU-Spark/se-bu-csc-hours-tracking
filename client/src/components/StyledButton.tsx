"use client";
import React, { useState } from "react";
import { Button } from "antd";
import { buRed } from "@/common/styles";

interface StyledButtonProps {
  text: string;
  onClick: () => Promise<void>;
}

const StyledButton: React.FC<StyledButtonProps> = ({ text, onClick }) => {
  const [hover, setHover] = useState(false);

  return (
    <Button
      style={{
        borderRadius: "20px",
        marginBottom: "0rem",
        width: "6rem",
        color: hover ? "white" : buRed,
        borderColor: buRed,
        backgroundColor: hover ? buRed : "transparent",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
    >
      {text}
    </Button>
  );
};

export default StyledButton;
