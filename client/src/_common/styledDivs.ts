import { InputNumber, Upload } from "antd";
import styled from "styled-components";

export const HeaderOffset = styled.div`
  margin-top: 70px;
`;

export const SummaryContainer = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

export const SummaryBox = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  font-weight: bold;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  width: 150px;
  margin: 10px;

  h2 {
    color: rgba(204, 0, 0, 1);
    font-size: 2rem;
    margin: 0 10px 0 0;
  }

  p {
    font-size: 1rem;
    color: #000;
    margin: 0;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    width: auto;
    h2 {
      margin: 0 0 10px 0;
    }
  }
`;

export const HoursGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0 20px;
`;

export const HoursItem = styled.div<{ status: number }>`
  display: flex;
  align-items: center;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #f9f9f9;
  width: calc(100% - 40px);
  max-width: 1000px;
  margin: 0 auto;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }

  img {
    width: 100px;
    height: 100px;
    border-radius: 10px;
    object-fit: cover;

    @media (max-width: 768px) {
      margin-bottom: 10px;
    }
  }

  .divider {
    width: 2px;
    height: 100px;
    background-color: rgba(204, 0, 0, 1);
    margin-left: 20px;
    margin-right: 20px;

    @media (max-width: 768px) {
      height: 2px;
      width: 100%;
      margin: 10px 0;
    }
  }

  .details {
    display: flex;
    flex-grow: 1;
    justify-content: space-between;
    align-items: center;
    padding-left: 20px;

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: flex-start;
      padding-left: 0;
    }
  }

  .section {
    flex: 1;
    padding: 0 20px;

    &:first-child {
      padding-left: 0;
    }

    &:last-child {
      padding-right: 0;
    }

    display: flex;
    flex-direction: column;
    justify-content: center;

    @media (max-width: 768px) {
      padding: 10px 0;
    }
  }

  .status {
    font-weight: bold;
    color: ${(props) =>
      props.status === 1 ? "green" : props.status === 0 ? "red" : "orange"};
    text-transform: capitalize;
  }

  .date {
    color: #888;
  }
`;

export const EventName = styled.h3`
  font-weight: bold;
  margin: 0;
`;

export const SubTitle = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: #555;
`;

export const BoldText = styled.p`
  font-weight: bold;
  margin: 0;
`;

export const SubText = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: #555;
`;

export const AddHoursButtonContainer = styled.div`
  position: fixed;
  top: 100px;
  right: 20px;
  display: flex;
  align-items: center;
`;

export const AddHoursButton = styled.button`
  display: flex;
  align-items: center;
  background-color: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  position: relative;
  font-size: 1vw;

  @media (min-width: 600px) {
    font-size: 0.5rem;
  }

  @media (min-width: 768px) {
    font-size: 0.75rem;
  }

  @media (min-width: 992px) {
    font-size: 0.75rem;
  }
`;

export const PlusCircle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3em;
  height: 3em;
  border-radius: 50%;
  background-color: #fff;
  border: 0.2em solid rgba(204, 0, 0, 1);
  color: rgba(204, 0, 0, 1);
  font-size: 1.5em;
  position: relative;
  z-index: 2;

  @media (max-width: 600px) {
    font-size: 1.5em;
  }
`;

export const Rectangle = styled.div`
  display: flex;
  align-items: center;
  background-color: rgba(204, 0, 0, 1);
  color: #fff;
  border-radius: 25px;
  border: 0.25em solid rgba(204, 0, 0, 1);
  font-weight: bold;
  height: 4.5em;
  line-height: 1.5em;
  position: relative;
  left: -4em;
  padding-left: 4em;
  padding-right: 1.5em;
  font-size: 1em;

  @media (max-width: 600px) {
    font-size: 1em;
  }
`;

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

export const PopupContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-width: 90%;
  width: 500px;

  h3 {
    margin-top: 0;
  }

  button {
    background-color: rgba(204, 0, 0, 1);
    color: #fff;
    border: none;
    border-radius: 5px;
    padding: 10px 20px;
    cursor: pointer;
    margin-top: 20px;
    &:hover {
      background-color: rgba(153, 0, 0, 1);
    }
  }
`;

export const FormContainer = styled.div`
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  border-radius: 8px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const BackButton = styled.div`
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

export const Label = styled.label`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 1rem;
  margin-bottom: 20px;
`;

export const LabelTitle = styled.span`
  display: flex;
  align-items: center;
`;

export const Asterisk = styled.span`
  color: red;
  margin-left: 5px;
`;

export const CommonInputStyle = `
  padding: 10px;
  border-radius: 8px;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
  margin-top: 8px;
  border: 1px solid #ccc;
  font-family: inherit;
`;

export const StyledInputNumber = styled(InputNumber)`
  ${CommonInputStyle}
`;

export const TextArea = styled.textarea`
  ${CommonInputStyle}
  resize: none;
`;

export const SubmitButton = styled.button`
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

export const FileUpload = styled(Upload)`
  ${CommonInputStyle}
`;
