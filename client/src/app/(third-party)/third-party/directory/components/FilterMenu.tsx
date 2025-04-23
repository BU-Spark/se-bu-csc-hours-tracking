"use client";

import React, { useState } from "react";
import styled from "styled-components";
import { FiFilter } from "react-icons/fi";

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: #f0f0f0;
  border: none;
  border-radius: 8px;
  padding: 10px 15px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const FilterContainer = styled.div`
  position: relative;
`;

const FilterDropdown = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  width: 250px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 16px;
  margin-top: 8px;
  z-index: 10;
  display: ${props => props.isOpen ? 'block' : 'none'};
`;

const FilterSection = styled.div`
  margin-bottom: 16px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const FilterTitle = styled.h4`
  margin: 0 0 10px 0;
  font-size: 16px;
  font-weight: 500;
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  cursor: pointer;
`;

const Checkbox = styled.input`
  cursor: pointer;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
`;

const Button = styled.button<{ primary?: boolean }>`
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  background-color: ${props => props.primary ? '#cc0000' : '#f0f0f0'};
  color: ${props => props.primary ? 'white' : 'black'};
  
  &:hover {
    background-color: ${props => props.primary ? '#aa0000' : '#e0e0e0'};
  }
`;

interface FilterMenuProps {
  onFilterChange: (filters: FilterOptions) => void;
}

export interface FilterOptions {
  tags: string[];
  locations: string[];
}

const FilterMenu: React.FC<FilterMenuProps> = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    tags: [],
    locations: []
  });
  
  const toggleFilter = () => {
    setIsOpen(!isOpen);
  };
  
  const handleTagChange = (tag: string) => {
    setFilters(prev => {
      const newTags = prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag];
      
      return { ...prev, tags: newTags };
    });
  };
  
  const handleLocationChange = (location: string) => {
    setFilters(prev => {
      const newLocations = prev.locations.includes(location)
        ? prev.locations.filter(l => l !== location)
        : [...prev.locations, location];
      
      return { ...prev, locations: newLocations };
    });
  };
  
  const applyFilters = () => {
    onFilterChange(filters);
    setIsOpen(false);
  };
  
  const resetFilters = () => {
    setFilters({ tags: [], locations: [] });
    onFilterChange({ tags: [], locations: [] });
  };
  
  return (
    <FilterContainer>
      <FilterButton onClick={toggleFilter}>
        <FiFilter /> Filters
      </FilterButton>
      
      <FilterDropdown isOpen={isOpen}>
        <FilterSection>
          <FilterTitle>Tags</FilterTitle>
          <CheckboxGroup>
            <CheckboxLabel>
              <Checkbox 
                type="checkbox" 
                checked={filters.tags.includes("Food Insecurity")}
                onChange={() => handleTagChange("Food Insecurity")} 
              />
              Food Insecurity
            </CheckboxLabel>
            <CheckboxLabel>
              <Checkbox 
                type="checkbox" 
                checked={filters.tags.includes("Nutrition Education")}
                onChange={() => handleTagChange("Nutrition Education")} 
              />
              Nutrition Education
            </CheckboxLabel>
            <CheckboxLabel>
              <Checkbox 
                type="checkbox" 
                checked={filters.tags.includes("Youth Outreach")}
                onChange={() => handleTagChange("Youth Outreach")} 
              />
              Youth Outreach
            </CheckboxLabel>
            <CheckboxLabel>
              <Checkbox 
                type="checkbox" 
                checked={filters.tags.includes("Poverty Alleviation")}
                onChange={() => handleTagChange("Poverty Alleviation")} 
              />
              Poverty Alleviation
            </CheckboxLabel>
          </CheckboxGroup>
        </FilterSection>
        
        <FilterSection>
          <FilterTitle>Location</FilterTitle>
          <CheckboxGroup>
            <CheckboxLabel>
              <Checkbox 
                type="checkbox" 
                checked={filters.locations.includes("Boston")}
                onChange={() => handleLocationChange("Boston")} 
              />
              Boston
            </CheckboxLabel>
            <CheckboxLabel>
              <Checkbox 
                type="checkbox" 
                checked={filters.locations.includes("Cambridge")}
                onChange={() => handleLocationChange("Cambridge")} 
              />
              Cambridge
            </CheckboxLabel>
            <CheckboxLabel>
              <Checkbox 
                type="checkbox" 
                checked={filters.locations.includes("Somerville")}
                onChange={() => handleLocationChange("Somerville")} 
              />
              Somerville
            </CheckboxLabel>
            <CheckboxLabel>
              <Checkbox 
                type="checkbox" 
                checked={filters.locations.includes("Brookline")}
                onChange={() => handleLocationChange("Brookline")} 
              />
              Brookline
            </CheckboxLabel>
          </CheckboxGroup>
        </FilterSection>
        
        <ButtonContainer>
          <Button onClick={resetFilters}>Reset</Button>
          <Button primary onClick={applyFilters}>Apply</Button>
        </ButtonContainer>
      </FilterDropdown>
    </FilterContainer>
  );
};

export default FilterMenu; 