"use client";

import React, { useEffect, useState } from "react";
import { useSession } from '@clerk/clerk-react';
import { useRouter } from "next/navigation";
import { HeaderOffset } from "@/_common/styledDivs";
import { Spin } from "antd";
import { getAllOrganizations } from "./action";
import OrganizationCard from "./components/OrganizationCard";
import FilterMenu, { FilterOptions } from "./components/FilterMenu";
import styled from "styled-components";
import { OrganizationWithEvents } from "./action";

const DirectoryContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const DirectoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin: 0;
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
  flex-grow: 1;
  margin: 0 20px;
`;

const SearchInput = styled.input`
  flex-grow: 1;
  padding: 12px 20px;
  border: 1px solid #ebebeb;
  border-radius: 8px;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #cc0000;
  }
`;

const DirectoryPage: React.FC = () => {
  const { session, isSignedIn, isLoaded } = useSession();
  const router = useRouter();
  const [organizations, setOrganizations] = useState<OrganizationWithEvents[]>([]);
  const [filteredOrganizations, setFilteredOrganizations] = useState<OrganizationWithEvents[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FilterOptions>({
    tags: [],
    locations: []
  });

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const orgs = await getAllOrganizations();
        setOrganizations(orgs);
        setFilteredOrganizations(orgs);
      } catch (error) {
        console.error("Error fetching organizations:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isSignedIn) {
      fetchOrganizations();
    }
  }, [isSignedIn]);
  
  // Apply search and filters
  useEffect(() => {
    let results = organizations;
    
    // Apply search
    if (searchTerm.trim() !== "") {
      results = results.filter(org => 
        org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.state.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply tag filters
    if (filters.tags.length > 0) {
      results = results.filter(org => {
        return filters.tags.some(tag => 
          org.collaboration_tags?.includes(tag)
        );
      });
    }
    
    // Apply location filters
    if (filters.locations.length > 0) {
      results = results.filter(org => 
        filters.locations.includes(org.city)
      );
    }
    
    setFilteredOrganizations(results);
  }, [searchTerm, filters, organizations]);
  
  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  if (loading) {
    return (
      <HeaderOffset>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
          <Spin size="large" />
        </div>
      </HeaderOffset>
    );
  }

  return (
    <HeaderOffset>
      <DirectoryContainer>
        <DirectoryHeader>
          <Title>Organizations Directory</Title>
          <SearchContainer>
            <SearchInput 
              type="text" 
              placeholder="Search for organization..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchContainer>
          <FilterMenu onFilterChange={handleFilterChange} />
        </DirectoryHeader>

        {filteredOrganizations.length === 0 ? (
          <div style={{ textAlign: "center", margin: "50px 0" }}>
            <p>No organizations found. Try adjusting your search or filters.</p>
          </div>
        ) : (
          filteredOrganizations.map(org => (
            <OrganizationCard key={org.id} organization={org} />
          ))
        )}
      </DirectoryContainer>
    </HeaderOffset>
  );
};

export default DirectoryPage;

