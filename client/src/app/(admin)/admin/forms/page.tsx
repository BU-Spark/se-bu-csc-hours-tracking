"use client";
import React, { useEffect } from "react";
import StyledButton from "@/components/StyledButton";
import { useRouter } from "next/navigation";

const Forms: React.FC = () => {
  const router = useRouter();

  const navigate = () => {
    router.push("/admin/forms/add-form");
  };
  return (
    <div>
      <StyledButton
        text="+ Add Form"
        selected={true}
        onClick={() => {
          navigate();
        }}
      />
    </div>
  );
};

export default Forms;
