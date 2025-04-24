import React, { useState } from "react";
import { Select } from "antd";

const { Option } = Select;

interface SemesterFilterProps {
  setSemester: (semester: string) => void;
}

// Function to generate semester options dynamically
const generateSemesterOptions = (): string[] => {
  const currentYear = new Date().getFullYear();
  const yearsRange = 4;
  const semesters = ["Spring", "Summer", "Fall"];
  const options: string[] = [];

  for (let year = currentYear - yearsRange; year <= currentYear; year++) {
    semesters.forEach((semester) => {
      options.push(`${semester} ${year}`);
    });
  }

  return options;
};

const SemesterFilter: React.FC<SemesterFilterProps> = ({ setSemester }) => {
  const [selectedSemester, setSelectedSemester] = useState<string>();
  const semesterOptions = generateSemesterOptions();

  const handleChange = (value: string) => {
    setSelectedSemester(value);
    setSemester(value);
  };

  return (
    <div
      style={{
        width: "100%",
        marginBottom: "1rem",
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
        {semesterOptions.map((semester) => (
          <Option key={semester} value={semester}>
            {semester}
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default SemesterFilter;