import React, { useState } from 'react';
import styled from 'styled-components';
import { AiOutlineClose } from 'react-icons/ai';

const FormContainer = styled.div`
  width: 90%;
  max-width: 500px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  box-sizing: border-box;

  @media (min-width: 600px) {
    width: 80%;
  }

  @media (min-width: 768px) {
    width: 60%;
  }

  @media (min-width: 992px) {
    width: 50%;
  }

  @media (min-width: 1200px) {
    width: 40%;
  }
`;

const CloseButton = styled(AiOutlineClose)`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  font-size: 1.5rem;
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  margin-bottom: 10px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
`;

const TextArea = styled.textarea`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  width: 100%;
  resize: none;
  box-sizing: border-box;
`;

const SubmitButton = styled.button`
  padding: 10px;
  border: none;
  border-radius: 8px;
  background-color: #ff0000;
  color: #fff;
  cursor: pointer;
  font-size: 1rem;
  &:hover {
    background-color: #cc0000;
  }
`;

interface AddHoursFormProps {
  onSubmit: (event: string, hours: number, comments: string) => void;
  onClose: () => void;
}

const AddHoursForm: React.FC<AddHoursFormProps> = ({ onSubmit, onClose }) => {
  const [event, setEvent] = useState('');
  const [hours, setHours] = useState('');
  const [comments, setComments] = useState('');

  const handleSubmit = () => {
    onSubmit(event, parseFloat(hours), comments);
    onClose();
  };

  return (
    <FormContainer>
      <CloseButton onClick={onClose} />
      <Label>
        Event
        <Input
          type="text"
          value={event}
          onChange={(e) => setEvent(e.target.value)}
        />
      </Label>
      <Label>
        Hours
        <Input
          type="number"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
        />
      </Label>
      <Label>
        Comments
        <TextArea
          rows={5}
          value={comments}
          onChange={(e) => setComments(e.target.value)}
        />
      </Label>
      <SubmitButton onClick={handleSubmit}>Submit</SubmitButton>
    </FormContainer>
  );
};

export default AddHoursForm;
