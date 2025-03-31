import React, { useState } from "react";
import { Select } from "antd";

const { Option } = Select;

interface SemesterFilterProps {
  setSemester: (semester: string) => void;
}

const SemesterFilter: React.FC<SemesterFilterProps> = ({ setSemester }) => {
  const [selectedSemester, setSelectedSemester] = useState<string>(null);

  const handleChange = (value: string) => {
    setSelectedSemester(value);
    setSemester(value);
  };

  return (
    <div
    style={{
      width: "100%",
      marginBottom: "1rem"
    }}
    >
      <Select
        value={selectedSemester}
        onChange={handleChange}
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "transparent",
          border: "none",
          boxShadow: "none",
          color: "inherit",
        }}
        dropdownStyle={{
          backgroundColor: "#f0f0f0",
        }}
        placeholder="Select Semester"
        allowClear
      >
        <Option value="Spring 2024">Spring 2024</Option>
        <Option value="Fall 2024">Fall 2024</Option>
      </Select>
    </div>
  );
};

export default SemesterFilter;