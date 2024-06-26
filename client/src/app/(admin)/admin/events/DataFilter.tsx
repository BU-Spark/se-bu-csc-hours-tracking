"use client";
import React, { useState, useEffect } from "react";
import { Button } from "antd";

interface DateFilterProps {
  setDateFilter: (date: Date) => void;
}

const DateFilter: React.FC<DateFilterProps> = ({ setDateFilter }) => {
  const [date, setDate] = useState<Date>(new Date());

  const incrementMonth = () => {
    setDate((prevDate) => {
      const newDate = new Date(
        prevDate.getFullYear(),
        prevDate.getMonth() + 1,
        1
      );
      setDateFilter(newDate);
      return newDate;
    });
  };

  const decrementMonth = () => {
    setDate((prevDate) => {
      const newDate = new Date(
        prevDate.getFullYear(),
        prevDate.getMonth() - 1,
        1
      );
      setDateFilter(newDate);
      return newDate;
    });
  };

  // Function to format date to "Month, Year"
  const formatDate = (date: Date) => {
    const monthOptions: Intl.DateTimeFormatOptions = { month: "long" };
    const month = date.toLocaleDateString("en-US", monthOptions);
    const year = date.getFullYear();
    return `${month}, ${year}`;
  };

  return (
    <div
      style={{
        fontSize: "x-large",
        display: "flex",
        alignItems: "center",
        marginBottom: "2rem",
      }}
    >
      <Button
        style={{ fontSize: "x-large", margin: "0 1rem", border: "none" }}
        onClick={decrementMonth}
      >
        {" "}
        {"<"}
      </Button>
      <div style={{ minWidth: "180px", textAlign: "center" }}>
        {formatDate(date)}
      </div>
      <Button
        style={{ fontSize: "x-large", margin: "0 1rem", border: "none" }}
        onClick={incrementMonth}
      >
        {">"}
      </Button>
    </div>
  );
};

export default DateFilter;
