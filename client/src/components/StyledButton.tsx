"use client";
import React, { useState } from "react";
import { Button } from "antd";
import { buRed } from "@/_common/styles";

interface StyledButtonProps {
  text: string;
  onClick: () => any;
  selected: boolean | undefined;
}

const StyledButton: React.FC<StyledButtonProps> = ({
  text,
  onClick,
  selected,
}) => {
  const [hover, setHover] = useState<boolean>(false);

  const handleOnClick = () => {
    onClick();
  };

  return (
    <Button
      style={{
        borderRadius: "20px",
        marginBottom: "0rem",
        width: "6rem",
        color: hover || selected ? "white" : buRed,
        borderColor: buRed,
        backgroundColor: hover || selected ? buRed : "transparent",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={handleOnClick}
    >
      {text}
    </Button>
  );
};

export default StyledButton;