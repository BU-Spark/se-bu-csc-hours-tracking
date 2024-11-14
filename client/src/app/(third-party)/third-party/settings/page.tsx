"use client";
import React, { useEffect, useState } from "react";
import "react-phone-input-2/lib/style.css";
import styled from "styled-components";
import { checkIfNewUser, getOrganizationDetails, updateOrganizerDetails } from "./action";
import { useSession } from '@clerk/clerk-react';
import { useRouter } from "next/navigation";
import PhoneInput from "react-phone-input-2";
import Select from "react-select";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { Organization, Person } from "@prisma/client";
import { message } from "antd";

const FormContainer = styled.div`
  max-width: 1500px;
  margin: 50px auto;
  padding: 35px;
  border-radius: 20px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  gap: 20px;
  border: 2px solid #cc0000;
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
  display: flex;
  align-items: center;
  font-size: 1rem;
  margin-bottom: 5px;
`;

const ErrorLabel = styled(Label)`
  color: red;
  margin-left: 10px;
`;

const Asterisk = styled.span`
  color: red;
  margin-left: 5px;
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
  height: 40px;
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
  height: 40px;
  .form-control {
    width: calc(100% - 50px) !important;
    height: 40px;
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
  width: 79px;
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

const ResetButton = styled.button`
  padding: 10px;
  width: 66px;
  border: 1px solid #cc0000;
  border-radius: 8px;
  background-color: #fff;
  color: #cc0000;
  cursor: pointer;
  font-size: 1rem;
  &:hover {
    background-color: #bbb;
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

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 15px; 
  margin-top: 20px; 
`;


const Settings: React.FC = () => {
    const { isSignedIn } = useSession();
    const router = useRouter();
    const [isNewUser, setIsNewUser] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [showError, setShowError] = useState(false);
    const [formChanged, setFormChanged] = useState(false);
    const [initialLoadComplete, setInitialLoadComplete] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
  
    // Company Information state
    const [companyInfo, setCompanyInfo] = useState<{
      name: string;
      nameofservice: string;
      unit?: string;
      street: string;
      city: string;
      state: string;
      zipcode: string;
      apt?: string;
      image?: Buffer | Uint8Array;
      phone_number: string;
      email: string;
    }>({
      name: '',
      nameofservice: '',
      street: '',
      city: '',
      state: '',
      phone_number: '',
      email: '', 
      zipcode: '',
    });
  const [form,setFormInfo] = useState<{
    formName: string;
    required: boolean;
    notes: string;
    file?: Buffer | Uint8Array;
  }>({
    formName: '',
    required: false,
    notes: '',
  });

  useEffect(() => {
    if (isSignedIn) {
      const fetchUserStatus = async () => {
        const status = await checkIfNewUser();
        if (status.isNewUser) {
          setIsNewUser(true);
        } else {
          const user: Organization | undefined = await getOrganizationDetails();
          if (user) {
            //set company info here so that it can be pulled by the form if the fields exist
            setCompanyInfo({
              name: user.name || "",
              nameofservice: user.nameofservice || "",
              unit: user.unit || "",
              street: user.street || "",
              city: user.city|| "",
              state: user.state,
              zipcode: user.zipcode +"" || "",
              apt: user.apt || "",
              image: user.image || undefined,
              phone_number: user.phone_number || "",
              email: user.email || "",
            });
            setPhoneNumber(user.phone_number || "");
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
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [formSubmitted, initialLoadComplete, isNewUser]);

  const validateForm = () => {
    return (
      phoneNumber
    );
  };

  const success = (message: string) => {
    messageApi.open({
      type: "success",
      content: message,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCompanyInfo(prev => ({ ...prev, [name]: value }));
  };
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormInfo(prev => ({ ...prev, [name]: value }));
  };

  const convertFileToBase64 = (file: File) => {
		return new Promise<string>((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => {
				if (reader.result) {
					resolve((reader.result as string).split(",")[1]);
				} else {
					reject("File reading failed");
				}
			};
			reader.onerror = (error) => reject(error);
		});
	};

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const validFile: File = file ?? new File([], 'default.txt');
    //fix file upload
    const imageData = await convertFileToBase64(validFile);
    
    setCompanyInfo(prev => ({ ...prev, image: Buffer.from(imageData.split(',')[1], "base64") }));
  };

  const handleBackButtonClick = () => {
    router.push("/third-party/dashboard");
    setFormSubmitted(true);
    if (validateForm()) {
      router.push("/third-party/dashboard");
    } else {
      setShowError(true);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    const details = {
      name: companyInfo.name,
      nameofservice: companyInfo.nameofservice,
      street: companyInfo.street,
      city: companyInfo.city,
      state: companyInfo.state,
      zipcode: Number(companyInfo.zipcode),
      phone_number: phoneNumber,
      email: companyInfo.email, 
      apt: companyInfo.apt,
      image: companyInfo.image ? Buffer.from(companyInfo.image) : null, // Buffer or Uint8Array, depending on your setup
    };
    try {
      await updateOrganizerDetails(details);
      success("User settings updated");
    }
    catch (error) {
      console.error("Error updating organization details:", error);
    }
  };
  const handleReset = () => {
    setCompanyInfo({
      name: '',
      nameofservice: '',
      street: '',
      city: '',
      state: '',
      zipcode: '',
      apt: '',
      email: '',
      phone_number: '',
    });
    setPhoneNumber("");
  };

  const handleFormSubmit = () => {

  }
  const handleFormReset = () => {

  }

  if (status === "loading") {
    return <div>Loading...</div>;
  }
  console.log(companyInfo)
  return (
    <>
        <TopBar>
            <BackButton onClick={handleBackButtonClick}>
                <AiOutlineArrowLeft size={24} />
                <span>Return to Dashboard</span>
            </BackButton>
        </TopBar>
        <h1>Profile</h1>
        
        <FormContainer>
            <form onSubmit={handleSubmit}>
                <h2>Company Information</h2>
                <div style={{ display: 'flex', gap: '50px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', width: '600px' }}>
                        <Label>Name<Asterisk>*</Asterisk></Label>
                        <Input type="text" name="name" value={companyInfo.name} onChange={handleChange} required />
                        <Label>Name of Service<Asterisk>*</Asterisk></Label>
                        <Input type="text" name="nameofservice" value={companyInfo.nameofservice} onChange={handleChange} required />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', width: '375px' }}>
                        <Label>Image Upload</Label>
                        <Input type="file" onChange={handleFileChange} />
                    </div>
                </div>
                <div>
                    <h4>Company Address<Asterisk>*</Asterisk></h4>
                    <div style={{ display: 'flex', gap: '50px', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '600px' }}>
                            <Input type="text" name="street" value={companyInfo.street} onChange={handleChange} required placeholder="Street Name" />
                            <Input type="text" name="apt" value={companyInfo.apt} onChange={handleChange} placeholder="Apt, suite, building, unit, floor, etc." />
                            <Input type="text" name="city" value={companyInfo.city} onChange={handleChange} required placeholder="City" />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '375px' }}>
                            <Input type="text" name="state" value={companyInfo.state} onChange={handleChange} required placeholder="State" />
                            <Input type="text" name="zipcode" value={companyInfo.zipcode} onChange={handleChange} required placeholder="Zip Code" />
                        </div>
                    </div>
                </div>
                <div>
                    <h4>Contact Information</h4>
                    <div style={{ display: 'flex', gap: '150px', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '500px' }}>
                            <Label>Phone Number<Asterisk>*</Asterisk></Label>
                            <StyledPhoneInput value={phoneNumber} onChange={setPhoneNumber} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '375px' }}>
                            <Label>Email<Asterisk>*</Asterisk></Label>
                            <Input type="email" name="email" value={companyInfo.email} onChange={handleChange} required />
                        </div>
                    </div>
                </div>

                <ButtonContainer>
                    <ResetButton type="button" onClick={handleReset}>Reset</ResetButton>
                    {contextHolder}
                    <SubmitButton type="submit">Save</SubmitButton>
                </ButtonContainer>
            </form>
        
        </FormContainer>
        <FormContainer>
        <form onSubmit={handleFormSubmit}>
                <h2>Forms and Waivers</h2>
                <div style={{ display: 'flex', gap: '50px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', width: '600px' }}>
                        <Label>Name<Asterisk>*</Asterisk></Label>
                        <Input type="text" name="formName" value={form.formName} onChange={handleFormChange} required />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', width: '375px' }}>
                        <Label>Image Upload</Label>
                        <Input type="file" onChange={handleFileChange} />
                    </div>
                </div>
                <div>
                  <div style={{ display: 'flex', flexDirection: 'column', width: '1025px'}}>
                    <Label>Notes</Label>
                    <textarea name="notes" value={form.notes} onChange={handleFormChange} rows={8}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      width: '100%',
                      height: '100px',
                      boxSizing: 'border-box',
                      border: '1px solid #ccc',
                    }}/>
                  </div>
                </div>
                <ButtonContainer>
                    <ResetButton type="button" onClick={handleFormReset}>Reset</ResetButton>
                    {contextHolder}
                    <SubmitButton type="submit">Save</SubmitButton>
                </ButtonContainer>
            </form>
        </FormContainer>
    </>
  );
};



export default Settings;
