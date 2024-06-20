"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { checkIfNewUser, getUserDetails, updateUserDetails } from "./action";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import PhoneInput from "react-phone-input-2";
import Select from "react-select";
import "react-phone-input-2/lib/style.css";
import { AiOutlineArrowLeft } from "react-icons/ai";

const FormContainer = styled.div`
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  border-radius: 8px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const BackButton = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: 20px;
  color: #cc0000;

  &:hover {
    color: #ff0000;
  }

  svg {
    margin-right: 8px;
  }
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  font-size: 1rem;
  margin-bottom: 5px;
`;

const Asterisk = styled.span`
  color: red;
  margin-left: 5px;
`;

const CommonInputStyle = `
  padding: 10px;
  border-radius: 8px;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #ccc;
  font-family: inherit;
  margin-bottom: 20px; 
`;

const Input = styled.input`
  ${CommonInputStyle}
`;

const StyledPhoneInput = styled(PhoneInput)`
  width: 100%;

  .form-control {
    width: calc(100% - 50px) !important;
    padding: 10px;
    padding-left: 50px;
    border-radius: 8px;
    font-size: 1rem;
    box-sizing: border-box;
    border: 1px solid #ccc;
  }

  .flag-dropdown {
    position: absolute;
  }
`;

const SubmitButton = styled.button`
  padding: 10px;
  border: none;
  border-radius: 8px;
  background-color: rgba(204, 0, 0, 1);
  color: #fff;
  cursor: pointer;
  font-size: 1rem;
  &:hover {
    background-color: rgba(153, 0, 0, 1);
  }
`;

const dietaryOptions = [
  { value: "none", label: "None" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "gluten_free", label: "Gluten-Free" },
  { value: "dairy_free", label: "Dairy-Free" },
  { value: "nut_free", label: "Nut-Free" },
  { value: "halal", label: "Halal" },
  { value: "kosher", label: "Kosher" },
];

const Settings: React.FC = () => {
  const { status } = useSession();
  const router = useRouter();
  const [isNewUser, setIsNewUser] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [college, setCollege] = useState<string>("");
  const [classYear, setClassYear] = useState<string>("");
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);

  useEffect(() => {
    if (status === "authenticated") {
      const fetchUserStatus = async () => {
        const status = await checkIfNewUser();
        if (status.isNewUser) {
          setIsNewUser(true);
        } else {
          const user = await getUserDetails();
          if (user) {
            setPhoneNumber(user.phone_number || "");
            setCollege(user.college || "");
            setClassYear(user.class?.toString() || "");
            setDietaryRestrictions(
              user.dietary_restrictions
                ? user.dietary_restrictions.split(",")
                : []
            );
          }
        }
      };

      fetchUserStatus();
    }
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUserDetails({
        phone_number: phoneNumber,
        college,
        class: Number(classYear),
        dietary_restrictions: dietaryRestrictions.join(","),
      });
      router.push("/dashboard");
    } catch (error) {
      console.error("Error updating user details:", error);
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <FormContainer>
      <BackButton onClick={() => router.push("/dashboard")}>
        <AiOutlineArrowLeft size={24} />
        <span>Back to Dashboard</span>
      </BackButton>
      <h1>Settings</h1>
      <form onSubmit={handleSubmit}>
        <Label>
          Phone Number<Asterisk>*</Asterisk>
        </Label>
        <StyledPhoneInput
          country={"us"}
          value={phoneNumber}
          onChange={(phone) => setPhoneNumber(phone)}
          inputStyle={{
            padding: "10px",
            borderRadius: "8px",
            paddingLeft: "50px",
          }}
          containerStyle={{ marginBottom: "20px" }}
        />
        <Label>
          College<Asterisk>*</Asterisk>
        </Label>
        <Input
          type="text"
          value={college}
          onChange={(e) => setCollege(e.target.value)}
        />
        <Label>
          Class Year<Asterisk>*</Asterisk>
        </Label>
        <Input
          type="text"
          value={classYear}
          onChange={(e) => setClassYear(e.target.value)}
        />
        <Label>
          Dietary Restrictions<Asterisk>*</Asterisk>
        </Label>
        <Select
          isMulti
          options={dietaryOptions}
          value={dietaryOptions.filter((option) =>
            dietaryRestrictions.includes(option.value)
          )}
          onChange={(selected) =>
            setDietaryRestrictions(selected.map((option) => option.value))
          }
          styles={{
            container: (provided) => ({
              ...provided,
              marginBottom: "20px",
            }),
            control: (provided) => ({
              ...provided,
              padding: "10px",
              borderRadius: "8px",
              fontSize: "1rem",
              width: "100%",
              boxSizing: "border-box",
              border: "1px solid #ccc",
              fontFamily: "inherit",
            }),
          }}
        />
        <SubmitButton type="submit">Submit</SubmitButton>
      </form>
    </FormContainer>
  );
};

export default Settings;
