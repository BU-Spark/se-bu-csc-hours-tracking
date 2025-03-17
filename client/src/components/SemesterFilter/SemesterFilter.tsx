import React, { useState } from "react";
import { Select } from "antd";

const { Option } = Select;

interface SemesterFilterProps {
  setSemester: (semester: string) => void;
}

const SemesterFilter: React.FC<SemesterFilterProps> = ({ setSemester }) => {
  const [selectedSemester, setSelectedSemester] = useState<string>("");

  const handleChange = (value: string) => {
    setSelectedSemester(value);
    setSemester(value);
  };

  return (
    <Select
      value={selectedSemester}
      onChange={handleChange}
      style={{ width: 200 }}
      placeholder="Select Semester"
    >
      <Option value="Spring 2024">Spring 2024</Option>
      <Option value="Fall 2024">Fall 2024</Option>
    </Select>
  );
};

export default SemesterFilter;