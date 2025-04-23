"use client";

import "react-phone-input-2/lib/style.css";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { checkIfNewUser, getUserDetails, updateUserDetails } from "./action";
import { useSession } from '@clerk/clerk-react'
import { useRouter } from "next/navigation";
import PhoneInput from "react-phone-input-2";
import Select from "react-select";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { Person } from "@prisma/client";
import {Form, message} from "antd";

const FormContainer = styled.div`
  max-width: 1000px;
  min-width: 600px;
  margin: 50px auto;
  padding: 40px;
  background-color: #f0f0f0;
  border-radius: 16px;
`;
const InnerCard = styled.div`
  background-color: #ffffff;
  padding: 40px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 40px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;


const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const BackButton = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #cc0000;

  &:hover {
    color: #ff0000;
  }

  svg {
    margin-right: 8px;
  }
`;

const InquiryButton = styled.button`
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

const Label = styled.label`
  font-weight: 600;
  font-size: 1.2rem;
  margin-bottom: 6px;
`;

const ErrorLabel = styled(Label)`
  color: red;
  margin-left: 10px;
`;

const Asterisk = styled.span`
  color: red;
  margin-left: 5px;
`;

const LabelTitle = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
`;

const ErrorMessage = styled.span`
  color: red;
  margin-left: 10px;
  font-size: 0.875rem;
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
  padding: 12px;
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

const ProfileImageContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 0;
`;

const ProfileImage = styled.img`
  width: 70px !important;
  height: 70px !important;
  border-radius: 50%;
  object-fit: cover;
  margin: 0 10px;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 20px;
  font-weight: bold;
  align-self: flex-start;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
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
  const { isSignedIn, isLoaded, session } = useSession();
  const router = useRouter();
  const [isNewUser, setIsNewUser] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [buId, setBuId] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [college, setCollege] = useState<string[]>([]);
  const [classYear, setClassYear] = useState<string>("");
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [hourGoal, setHourGoal] = useState<number>(90);
  const [goalDate, setGoalDate] = useState<string>("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showError, setShowError] = useState(false);
  const [formChanged, setFormChanged] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [profileImage, setProfileImage] = useState<string>("");

  useEffect(() => {
    if (isSignedIn) {
      const fetchUserStatus = async () => {
        const status = await checkIfNewUser();
        if (status.isNewUser) {
          setIsNewUser(true);
        } else {
          const user: Person | undefined = await getUserDetails();
          if (user) {
            setPhoneNumber(user.phone_number || "");
            setBuId(user.bu_id || "");
            setUserName(user.name || "");
            setCollege(user.college ? user.college.split(",") : []);
            setClassYear(user.class?.toString() || "");
            setDietaryRestrictions(
                user.dietary_restrictions ? user.dietary_restrictions.split(",") : []
            );
            setHourGoal(user.hour_goal || 90);
            setGoalDate(user.goal_date ? new Date(user.goal_date).toISOString().split('T')[0] : "");
            if (user.image) setProfileImage(Buffer.from(user.image).toString('base64'));
          }
        }
        setInitialLoadComplete(true);
      };
      fetchUserStatus();
    }
  }, [isSignedIn]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!formSubmitted && initialLoadComplete && isNewUser) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [formSubmitted, initialLoadComplete, isNewUser]);

  const validateForm = () => {
    return (
        phoneNumber &&
        userName &&
        buId &&
        college.length > 0 &&
        classYear &&
        dietaryRestrictions.length > 0
    );
  };

  const success = (message: string) => {
    messageApi.open({ type: "success", content: message });
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
    if (!validateForm()) {
      setShowError(true);
      return;
    }

    try {
      await updateUserDetails({
        phone_number: phoneNumber,
        name: userName,
        bu_id: buId,
        college: college.join(","),
        class: parseInt(classYear),
        dietary_restrictions: dietaryRestrictions.join(","),
        hour_goal: hourGoal,
        goal_date: goalDate ? new Date(goalDate) : null,
        image: profileImage || undefined,
      });
      success("Settings updated successfully");
      setFormSubmitted(true);
      setFormChanged(false);
    } catch (error) {
      console.error("Error updating user details:", error);
    }
  };

  const handleInputChange = () => setFormChanged(true);
  const convertFileToBase64 = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        if (reader.result) {
          const base64String = (reader.result as string).split(",")[1];
          resolve(base64String);
        } else {
          reject("File reading failed");
        }
      };

      reader.onerror = (error) => reject(error); // Handle any errors in file reading
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try{
      const imageData = await convertFileToBase64(file);
      // Check if the Base64 string is in the expected format (Data URL format)
      const base64Prefix = "data:image";
      if (imageData.startsWith(base64Prefix)) {
        const base64String = imageData.split(',')[1]; // Extract Base64 part
        setProfileImage(base64String);// Store only the Base64 part in the state

      } else {
        setProfileImage(imageData);// Store the Base64 string
      }
    } catch (error) {
      console.error("Error converting file to Base64:", error);
    }
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
      <FormContainer>
        <TopBar>
          <BackButton onClick={handleBackButtonClick}>
            <AiOutlineArrowLeft size={24} />
            <span>Return to My Hours</span>
          </BackButton>
          <InquiryButton onClick={() => router.push("/user/onboarding")}>Rewatch Onboarding</InquiryButton>
        </TopBar>
        <h1>Settings</h1>
        {formChanged && <ChangeMessageContainer>
          Please press the submit button to save your changes.
        </ChangeMessageContainer>}
        <form onSubmit={handleSubmit}>
          <InnerCard>
            <Label>Upload Profile Picture</Label>
            <ProfileImageContainer>
              {profileImage && (
                  <ProfileImage
                      src={`data:image/jpeg;base64,${profileImage}`}
                      alt="Profile Preview"
                      style={{ width: "120px", height: "120px", borderRadius: "50%", objectFit: "cover", marginBottom: "0" }}
                  />
              )}

              <Input type="file" accept="image/*" onChange={
                (e) => {
                  handleImageChange(e);
                  setFormChanged(true);
                }
              } />
            </ProfileImageContainer>
            <FormGrid>
              <FieldGroup>
                <Label>
                  Name <Asterisk>*</Asterisk>
                  {formSubmitted && !userName && (
                      <ErrorMessage>BU ID is required</ErrorMessage>
                  )}
                </Label>

                <Input
                    type="text"
                    placeholder="Your Name"
                    value={userName}
                    maxLength={100}
                    onChange={(e) => {
                      setUserName(e.target.value);
                      handleInputChange();
                    }}
                    required
                />
                <Label>
                  Phone Number<Asterisk>*</Asterisk>
                  {formSubmitted && !phoneNumber && (
                      <ErrorMessage>Phone number is required</ErrorMessage>
                  )}
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

                <Label>
                  BU ID<Asterisk>*</Asterisk>
                  {formSubmitted && !buId && (
                      <ErrorMessage>BU ID is required</ErrorMessage>
                  )}
                </Label>
                <Input
                    type="text"
                    placeholder="U12345678"
                    maxLength={9}
                    minLength={9}
                    value={buId}
                    onChange={(e) => {
                      setBuId(e.target.value);
                      handleInputChange();
                    }}
                    required
                />
                <Label>
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
              </FieldGroup>
              <FieldGroup>
                <Label>
                  Class Year<Asterisk>*</Asterisk>
                  {formSubmitted && !classYear && (
                      <ErrorMessage>Class year is required</ErrorMessage>
                  )}
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

                <Label>
                  <LabelTitle>
                    Dietary Restrictions
                    <Asterisk>*</Asterisk>
                  </LabelTitle>
                  <Select
                      isMulti
                      options={dietaryOptions}
                      value={dietaryRestrictions.map((restriction) => ({
                        value: restriction,
                        label: restriction,
                      }))}
                      onChange={(selectedOptions) =>
                          setDietaryRestrictions(
                              selectedOptions.map((option) => option.value)
                          )
                      }
                      styles={{
                        control: (base) => ({
                          ...base,
                          border: "1px solid #ccc",
                          borderRadius: "8px",
                          padding: "2px",
                        }),
                      }}
                  />
                </Label>

                <Label>
                  <LabelTitle>
                    Set an hourly goal
                  </LabelTitle>
                  <Input
                      type="number"
                      min="0"
                      value={hourGoal}
                      onChange={(e) => {
                        setHourGoal(Number(e.target.value));
                        handleInputChange();
                      }}
                      placeholder="Enter your hourly goal"
                  />
                </Label>

                <Label>
                  <LabelTitle>
                    Reach goal by
                  </LabelTitle>
                  <Input
                      type="date"
                      value={goalDate}
                      onChange={(e) => {
                        setGoalDate(e.target.value);
                        handleInputChange();
                      }}
                      min={new Date().toISOString().split('T')[0]}
                  />
                </Label>

                <div
                    style={{
                      opacity: formChanged ? "100%" : "40%",
                    }}
                >
                  {contextHolder}
                  <SubmitButton type="submit" disabled={formChanged ? false : true}>
                    Save Changes
                  </SubmitButton>
                </div>
              </FieldGroup>
            </FormGrid>
          </InnerCard>
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

export default Settings;
