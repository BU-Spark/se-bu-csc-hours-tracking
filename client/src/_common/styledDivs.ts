import { InputNumber, Upload } from "antd";
import styled from "styled-components";
import { buRed } from "./styles";

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
  border-style: solid;
  border-color: #cc0000;
  padding: 20px;
  text-align: center;
  font-weight: bold;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  width: 150px;
  margin: 10px;
  border: 2px solid ${buRed};

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
      props.status === 1 ? "green" : props.status === 2 ? "red" : "orange"};
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
  position: absolute;
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

// Updated Calendar Components
export const CalendarContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 3px;
  max-width: full;
  width: 656px;
  background: white;
  border-radius: 10px;
  overflow: hidden; /* This ensures content respects rounded corners */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

export const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  margin-bottom: 1rem;
`;

export const CalendarButton = styled.button<{ variant?: "outline" | "filled" }>`
  padding: 12px 36px;
  border: 1px solid ${buRed};
  border-radius: 100px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  ${(props) =>
    props.variant === "filled"
      ? `
    background-color: ${buRed};
    color: white;
  `
      : `
    background-color: white;
    color: ${buRed};
  `}

  &:hover {
    opacity: 0.9;
  }
`;

export const NavigationButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 2.5px;
    height: 15px;
  }
`;

export const DayHeader = styled.div`
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  padding: 10px 0;
  background-color: #D32F2F;
  color: white;
  width: 100%; /* Forces headers to fill the column */
  display: flex;
  justify-content: center;
  align-items: center;
  &:first-child {
    border-top-left-radius: 10px;
  }
  &:last-child {
    border-top-right-radius: 10px;
  }
`;

export const DayCell = styled.div<{ isToday?: boolean; isCurrentMonth?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 8px;
  min-height: 80px; /* Ensures equal height */
  width: 100%; /* Prevents cell shrinking */
  font-size: 16px;
  border: none; /* Remove unintended borders */
  background: ${(props) => (props.isCurrentMonth ? "#F8F9FA" : "#E0E0E0")}; /* Match colors */

  ${(props) =>
    props.isToday &&
    `
    position: relative;
    color: white;
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 26px;
      height: 26px;
      background-color: #D32F2F;
      border-radius: 50%;
      z-index: -1;
    }
  `}
`;

export const EventIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  margin-top: 4px;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.7;
  }
`;

export const EventDot = styled.div`
  width: 10px;
  height: 10px;
  background-color: #40e0d0;
  border-radius: 50%;
`;

export const EventLabel = styled.span`
  font-size: 12px;
  color: #1a1a1a;

  .time {
    font-weight: normal;
  }

  .event {
    font-weight: 600;
  }
`;

export const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(6, 1fr);
  gap: 0px;
  width: 100%;
  min-height: 500px;
  border-collapse: collapse;
  table-layout: fixed;
  border-radius: 0 0 10px 10px; /* Round bottom corners */
  overflow: hidden; /* Ensure child elements respect border radius */
`;

export const CalendarWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const MonthYearDisplay = styled.h2`
  font-size: 20px;
  font-weight: bold;
  margin: 0;
  color: #1a1a1a;
`;
