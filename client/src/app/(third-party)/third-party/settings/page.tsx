"use client";
import React, { useEffect, useState } from "react";
import "react-phone-input-2/lib/style.css";
import styled from "styled-components";
import { checkIfNewUser, createFormDetails, getFormDetails, getOrganizationDetails, updateFormDetails, updateOrganizerDetails, deleteForms } from "./action";
import { useSession } from '@clerk/clerk-react';
import { useRouter } from "next/navigation";
import PhoneInput from "react-phone-input-2";
import Select from "react-select";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { FormCode, Organization, Person } from "@prisma/client";
import { message } from "antd";
import { Switch } from 'antd';

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

const AddFormButton = styled.button`
  padding: 10px;
  width: 192.452px;
  height: 35px;
  border: 1px none #bbb;
  border-radius: 8px;
  background-color: #EBEBEB;
  border-radius: 100px;
  background: var(--Standard-Grey, #EBEBEB);
  box-shadow: 0px 5px 2px 0px rgba(0, 0, 0, 0.25);

  color: #cc0000;
  cursor: pointer;
  font-size: 1rem;
  text-align: center;
  font-family: Inter;
  font-size: 15px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  &:hover {
    background-color: #bbb;
  }
  svg {
    margin-right: 10px; 
    vertical-align: middle;  
  }
`;

const DeleteButton = styled.button`
  padding: 0;
  width: 20px; 
  height: 20px;
  border-radius: 50%;  
  border: none;
  background-color: #EBEBEB;
  color: #cc0000; 
  font-size: 14px;  
  text-align: center;  
  line-height: 20px;  
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #bbb; 
  }

  &:focus {
    outline: none;
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
    const { isSignedIn, isLoaded } = useSession();
    const router = useRouter();
    const [isNewUser, setIsNewUser] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [showError, setShowError] = useState(false);
    const [formChanged, setFormChanged] = useState(false);
    const [initialLoadComplete, setInitialLoadComplete] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [isFieldRequired, setIsFieldRequired] = useState(false);
    const [forms, setFormInfo] = useState<FormCode[]>([]); // State to hold multiple forms
    const [newFormCount, setNewFormCount] = useState<number>(0);
    const [deletedForms, setDeletedForms] = useState<FormCode[]>([]);
  
    
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
      image?: string;
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
              image: user.image ? Buffer.from(user.image).toString('base64') : undefined,
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

  useEffect(() => {
    const fetchForms = async () => {
      const data = await getFormDetails();
      if (data) {
        setFormInfo(data);
      } else {
        setFormInfo([]); // fallback to an empty array if data is undefined
      }
    };
    fetchForms();
  }, []);

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
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, id: number) => {
    const { name, value } = e.target;
    setFormInfo(prevForms =>
      prevForms.map(form =>
        form.id === id ? { ...form, [name]: value } : form
      )
    );
  };
  const handleSliderChange = (id:number, e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedForms = forms.map(form => 
      form.id === id ? { ...form, required: e.target.checked } : form
    );
    setFormInfo(updatedForms);
  };

  const convertFileToBase64 = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file); // Reads file as Data URL
  
      //console.log(reader);
      reader.onload = () => {
        if (reader.result) {
          // Split the result at the comma and take the Base64 part
          const base64String = (reader.result as string).split(",")[1];
          resolve(base64String); // Resolve with just the Base64 part
        } else {
          reject("File reading failed");
        }
      };
  
      reader.onerror = (error) => reject(error); // Handle any errors in file reading
    });
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
        console.error("No file selected");
        return;
    }

    try {
        const imageData = await convertFileToBase64(file);
        // Check if the Base64 string is in the expected format (Data URL format)
        const base64Prefix = "data:image";
        if (imageData.startsWith(base64Prefix)) {
            const base64String = imageData.split(',')[1]; // Extract Base64 part
            setCompanyInfo(prev => ({
                ...prev,
                image: base64String // Store only the Base64 part in the state
            }));
        } else {
            setCompanyInfo(prev => ({
              ...prev,
              image: imageData // Store the Base64 string
            }));
        }
    } catch (error) {
        console.error("Error converting file to Base64:", error);
    }  
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
    console.log(companyInfo.image);

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
      image: companyInfo.image, 
    };
    try {
      await updateOrganizerDetails(details);
      success("Organization settings updated");
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
  const handleFormFileChange = async (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const file = e.target.files?.[0];
    if (!file) {
        console.error("No file selected");
        return;
    }

    try {
        const fileData = await convertFileToBase64(file);
        // Check if the Base64 string is in the expected format (Data URL format)
        // NEED TO UPDATE FOR FILE INSTEAD OF IMAGE
        const base64Prefix = "data:image";
        if (fileData.startsWith(base64Prefix)) {
            const base64String = fileData.split(',')[1]; // Extract Base64 part
            setFormInfo(prev => ({
                ...prev,
                file: base64String // Store only the Base64 part in the state
            }));
        } else {
            setFormInfo(prev => ({
              ...prev,
              file: fileData // Store the Base64 string
            }));
        }
    } catch (error) {
        console.error("Error converting file to Base64:", error);
    }  
};
  // Function to handle adding a new form
  const addNewForm = () => {
    setFormInfo([
      ...forms,
      {
        id: Date.now(), title: '', description: '', required: false,
        downloadable: false,
        organization_id: 0,
        upload_link: null,
      } // Adding a new empty form
    ]);
    setNewFormCount((prevCount) => prevCount + 1);
  };
  const handleAllFormSubmits = async(e: React.FormEvent) =>{
    let formString: string | undefined = undefined;
    if (newFormCount > 0) {
      handleNewFormSubmit()
    }
    forms.forEach(async (form) => {
      const details = {
        name: form.title || "",
        required: form.required,
        notes: form.description || "",
        file: formString, 
      };
      try {
        await updateFormDetails(details, form.id);
        console.log(details.name, details.required);
      }
      catch (error) {
        console.error("Error updating organization details:", error);
      }
    });
    try {
      const deletedFormIds = deletedForms.map((form) => form.id);
      await deleteForms(deletedFormIds);
      setDeletedForms([]);
    }
    catch (error) {
      console.error("Error updating organization details:", error);
    }
    success("Forms updated");

  }
  const handleNewFormSubmit = () =>{
    let formString: string | undefined = undefined;
    const formsToSubmit = forms.slice(-newFormCount);
    formsToSubmit.forEach(async (form) => {
      const details = {
        name: form.title,
        required: form.required,
        notes: form.description,
        file: formString, 
      };
    
      try {
        await createFormDetails(details);
        console.log(details);
        // success("Form uploaded");
      }
      catch (error) {
        console.error("Error updating organization details:", error);
      }
    setNewFormCount(0);
    });
    

  };
  const handleFormSubmit = async (e: React.FormEvent, id: number) => {
    e.preventDefault();
    // Handle form submission logic here
    let formString: string | undefined = undefined;
    const form = forms.find(f => f.id === id);
    // if (form?.file) {
    //   // Need to change to check for form file
    //   const base64String = form.file.startsWith("data:image") 
    //     ? form.file.split(',')[1]  // Remove the "data:image/png;base64," prefix
    //     : form.file;  // Already a clean Base64 string
    //   formString = base64String;
    // }
    const details = {
        name: form?.title || "",
        required: isFieldRequired,
        notes: form?.description || "",
        file: formString, 
      };
    try {
      await createFormDetails(details);
    }
    catch (error) {
      console.error("Error updating organization details:", error);
    }
  };
  const handleFormReset = () => {

  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  const handleDelete = (id: number) =>{
    const deletedForm = forms.find(f => f.id === id);
    setDeletedForms(prevDeletedForms => [...prevDeletedForms, deletedForm!]);
    const updatedForms = forms.filter((form) => form.id !== id);

    setFormInfo(updatedForms);

  }

  //console.log(companyInfo)
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
                        <img src={`data:image/jpeg;base64,${companyInfo.image}`}
                          alt={companyInfo.image}
                          style={{
                            width: '200px',      // Set a fixed width for the image
                            height: 'auto',      // Maintain aspect ratio
                            borderRadius: '10px', // Rounded corners
                            border: '2px solid #ccc', // Optional border
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Optional shadow
                            objectFit: 'cover',  // Ensure the image covers the space
                          }}
                        />
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
        {Array.isArray(forms) && forms.length > 0 ? (
          forms.sort((a, b) => a.id - b.id).map((form) => (
          <div key={form.id}>
            
            <form onSubmit={(e) => handleFormSubmit(e, form.id)}>
              <div style={{ display: 'flex', gap: '50px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', width: '600px' }}>
                  <Label>Name<Asterisk>*</Asterisk></Label>
                  <Input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={(e) => handleFormChange(e, form.id)}
                    required
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', width: '375px' }}>
                  <Label>File Upload </Label>
                  <Input
                    type="file"
                    onChange={(e) => handleFormFileChange(e, form.id)}
                  ></Input> 
                </div>
                <DeleteButton onClick={() => handleDelete(form.id)}>x</DeleteButton>
              </div>

              <div>
                <label>Make required? No</label>
                <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '50px', height: '25px' }}>
                  <input
                    type="checkbox"
                    checked={form.required}
                    onChange={(e) => handleSliderChange(form.id, e)}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span className="slider" style={{
                    position: 'absolute',
                    cursor: 'pointer',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: form.required ? '#cc0000' : '#ccc',
                    transition: '0.4s',
                    borderRadius: '50px',
                  }}></span>
                  <span style={{
                    position: 'absolute',
                    content: '',
                    height: '20px',
                    width: '20px',
                    borderRadius: '50%',
                    left: '4px',
                    bottom: '4px',
                    backgroundColor: 'white',
                    transition: '0.4s',
                    transform: form.required ? 'translateX(25px)' : 'none',
                  }}></span>
                </label>
                <label>Yes</label>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', width: '1025px'}}>
                <Label>Notes</Label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={(e) => handleFormChange(e, form.id)}
                  rows={8}
                  style={{
                    padding: '10px',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    width: '100%',
                    height: '100px',
                    boxSizing: 'border-box',
                    border: '1px solid #ccc',
                  }}
                />
              </div>
            </form>
          </div>
        ))
      ): (
        <p>No forms available.</p>
      )}
      
      <AddFormButton onClick={addNewForm}>
        <svg xmlns="http://www.w3.org/2000/svg" width="27" height="18" viewBox="0 0 27 18" fill="none">
          <line x1="13.8558" x2="13.8558" y2="18" stroke="#CC0000"/>
          <line y1="-0.5" x2="25.5184" y2="-0.5" transform="matrix(0.999931 -0.0117507 0.0242414 0.999706 0.595703 9.30371)" stroke="#CC0000"/>
        </svg>
        Add New Form
      </AddFormButton>
      <ButtonContainer>
        <ResetButton type="button" onClick={handleFormReset}>Reset</ResetButton>
        <SubmitButton type="submit" onClick={handleAllFormSubmits}>Save</SubmitButton>
      </ButtonContainer>
      </FormContainer>
    </>
  );
};



export default Settings;
