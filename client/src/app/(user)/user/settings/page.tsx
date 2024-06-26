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

<<<<<<< HEAD
=======
const ErrorMessage = styled.span`
  color: red;
  margin-left: 10px;
  font-size: 0.875rem;
`;

>>>>>>> settings
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

const ErrorMessageContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 8px;
  z-index: 1000;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const ErrorButton = styled.button`
  background-color: #fff;
  color: #000;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const ChangeMessageContainer = styled.div`
  margin: 20px 0;
  padding: 10px;
  background-color: #e2e3e5;
  color: #383d41;
  border: 1px solid #d6d8db;
  border-radius: 8px;
  text-align: center;
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

<<<<<<< HEAD
=======
const collegeOptions = [
  { value: "cas", label: "CAS" },
  { value: "cds", label: "CDS" },
  { value: "cfa", label: "CFA" },
  { value: "cgs", label: "CGS" },
  { value: "com", label: "COM" },
  { value: "eng", label: "ENG" },
  { value: "khc", label: "KHC" },
  { value: "questrom", label: "Questrom" },
  { value: "sha", label: "SHA" },
  { value: "wheelock", label: "Wheelock" },
];

>>>>>>> settings
const generateClassYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = 0; i < 4; i++) {
    years.push({
      value: (currentYear + i).toString(),
      label: (currentYear + i).toString(),
    });
  }
  return years;
};

const Settings: React.FC = () => {
  const { status } = useSession();
  const router = useRouter();
  const [isNewUser, setIsNewUser] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
<<<<<<< HEAD
  const [college, setCollege] = useState<string>("");
=======
  const [buId, setBuId] = useState<string>("");
  const [college, setCollege] = useState<string[]>([]);
>>>>>>> settings
  const [classYear, setClassYear] = useState<string>("");
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showError, setShowError] = useState(false);
  const [formChanged, setFormChanged] = useState(false);

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
<<<<<<< HEAD
            setCollege(user.college || "");
=======
            setBuId(user.bu_id || "");
            setCollege(user.college ? user.college.split(",") : []);
>>>>>>> settings
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

  const validateForm = () => {
    return (
<<<<<<< HEAD
      phoneNumber && college && classYear && dietaryRestrictions.length > 0
=======
      phoneNumber &&
      buId &&
      college.length > 0 &&
      classYear &&
      dietaryRestrictions.length > 0
>>>>>>> settings
    );
  };

  const handleBackButtonClick = () => {
    setFormSubmitted(true);
    if (validateForm()) {
      router.push("/user/my-hours");
    } else {
      setShowError(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    if (!validateForm()) {
      setShowError(true);
      return;
    }
    try {
      await updateUserDetails({
        phone_number: phoneNumber,
<<<<<<< HEAD
        college,
=======
        bu_id: buId,
        college: college.join(","),
>>>>>>> settings
        class: Number(classYear),
        dietary_restrictions: dietaryRestrictions.join(","),
      });
      router.push("/user/my-hours");
    } catch (error) {
      console.error("Error updating user details:", error);
    }
  };

  const handleInputChange = () => {
    setFormChanged(true);
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <FormContainer>
      <BackButton onClick={handleBackButtonClick}>
        <AiOutlineArrowLeft size={24} />
        <span>Return to My Hours</span>
      </BackButton>
      <h1>Settings</h1>
      {formChanged && (
        <ChangeMessageContainer>
          Please press the submit button to save your changes.
        </ChangeMessageContainer>
      )}
      <form onSubmit={handleSubmit}>
        <Label>
          Phone Number<Asterisk>*</Asterisk>
<<<<<<< HEAD
=======
          {formSubmitted && !phoneNumber && (
            <ErrorMessage>Phone number is required</ErrorMessage>
          )}
>>>>>>> settings
        </Label>
        <StyledPhoneInput
          country={"us"}
          value={phoneNumber}
          onChange={(phone) => {
            setPhoneNumber(phone);
            handleInputChange();
          }}
          inputStyle={{
            padding: "10px",
            borderRadius: "8px",
            paddingLeft: "50px",
          }}
          containerStyle={{ marginBottom: "20px" }}
        />
<<<<<<< HEAD
        {formSubmitted && !phoneNumber && (
          <span style={{ color: "red" }}>Phone number is required</span>
        )}
        <Label>
          College<Asterisk>*</Asterisk>
        </Label>
        <Input
          type="text"
          value={college}
          onChange={(e) => {
            setCollege(e.target.value);
=======
        <Label>
          BU ID<Asterisk>*</Asterisk>
          {formSubmitted && !buId && (
            <ErrorMessage>BU ID is required</ErrorMessage>
          )}
        </Label>
        <Input
          type="text"
          placeholder="UXXXXXXXX"
          value={buId}
          onChange={(e) => {
            setBuId(e.target.value);
>>>>>>> settings
            handleInputChange();
          }}
          required
        />
        <Label>
<<<<<<< HEAD
          Class Year<Asterisk>*</Asterisk>
=======
          College<Asterisk>*</Asterisk>
          {formSubmitted && college.length === 0 && (
            <ErrorMessage>College is required</ErrorMessage>
          )}
        </Label>
        <Select
          isMulti
          options={collegeOptions}
          value={collegeOptions.filter((option) =>
            college.includes(option.value)
          )}
          onChange={(selected) => {
            setCollege(selected.map((option) => option.value));
            handleInputChange();
          }}
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
        <Label>
          Class Year<Asterisk>*</Asterisk>
          {formSubmitted && !classYear && (
            <ErrorMessage>Class year is required</ErrorMessage>
          )}
>>>>>>> settings
        </Label>
        <Select
          options={generateClassYearOptions()}
          value={generateClassYearOptions().find(
            (option) => option.value === classYear
          )}
          onChange={(selected) => {
            setClassYear(selected ? selected.value : "");
            handleInputChange();
          }}
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
<<<<<<< HEAD
        {formSubmitted && !classYear && (
          <span style={{ color: "red" }}>Class year is required</span>
        )}
        <Label>
          Dietary Restrictions<Asterisk>*</Asterisk>
=======
        <Label>
          Dietary Restrictions<Asterisk>*</Asterisk>
          {formSubmitted && dietaryRestrictions.length === 0 && (
            <ErrorMessage>Dietary restrictions are required</ErrorMessage>
          )}
>>>>>>> settings
        </Label>
        <Select
          isMulti
          options={dietaryOptions}
          value={dietaryOptions.filter((option) =>
            dietaryRestrictions.includes(option.value)
          )}
          onChange={(selected) => {
            setDietaryRestrictions(selected.map((option) => option.value));
            handleInputChange();
          }}
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
<<<<<<< HEAD
        {formSubmitted && dietaryRestrictions.length === 0 && (
          <span style={{ color: "red" }}>
            Dietary restrictions are required
          </span>
        )}
=======
>>>>>>> settings
        <SubmitButton type="submit">Submit</SubmitButton>
      </form>
      {showError && (
        <ErrorMessageContainer>
          <p>All fields are required before you can proceed.</p>
          <ErrorButton onClick={() => setShowError(false)}>Close</ErrorButton>
        </ErrorMessageContainer>
      )}
    </FormContainer>
  );
};

<<<<<<< HEAD
export default Settings;
=======
export default Settings;
>>>>>>> settings
