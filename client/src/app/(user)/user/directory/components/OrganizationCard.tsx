"use client";

import React, { useState } from "react";
import styled from "styled-components";
import { OrganizationWithEvents } from "../action";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";

// Styled components
const CardContainer = styled.div`
  background-color: #f5f5f5;
  border-radius: 10px;
  margin-bottom: 20px;
  overflow: hidden;
  transition: all 0.3s ease;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  cursor: pointer;
`;

const OrganizationInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const OrgImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 8px;
  object-fit: cover;
`;

const OrgDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const OrgName = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
`;

const OrgLocation = styled.p`
  margin: 0;
  font-size: 14px;
  color: #666;
`;

const MoreInfoButton = styled.button`
  background-color: #cc0000;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: 500;
  
  &:hover {
    background-color: #aa0000;
  }
`;

const CardContent = styled.div<{ isOpen: boolean }>`
  padding: ${props => props.isOpen ? "20px" : "0"};
  max-height: ${props => props.isOpen ? "2000px" : "0"};
  opacity: ${props => props.isOpen ? "1" : "0"};
  transition: max-height 0.5s ease, opacity 0.3s ease, padding 0.3s ease;
  overflow: hidden;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
`;

const Tag = styled.span`
  background-color: #ebebeb;
  color: #cc0000;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
`;

const SectionContainer = styled.div`
  margin-bottom: 30px;
`;

const SectionTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 10px;
  margin-top: 0;
`;

const SectionContent = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
`;

const EventsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const EventItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const EventTitle = styled.div`
  font-weight: 500;
`;

const EventArrow = styled.div`
  color: #cc0000;
`;

const Address = styled.div`
  margin-bottom: 20px;
`;

const ContactInfo = styled.div`
  margin-bottom: 20px;
`;

const FormItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

interface OrganizationCardProps {
  organization: OrganizationWithEvents;
}

const OrganizationCard: React.FC<OrganizationCardProps> = ({ organization }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Format the image as a base64 string for display
  const imageString = organization.image 
    ? `data:image/jpeg;base64,${Buffer.from(organization.image).toString('base64')}`
    : '/placeholder-org.png'; // Default image
  
  // Handle collaboration_tags as an array
  const tags = Array.isArray(organization.collaboration_tags) 
    ? organization.collaboration_tags 
    : [];
  
  return (
    <CardContainer>
      <CardHeader onClick={() => setIsOpen(!isOpen)}>
        <OrganizationInfo>
          <OrgImage src={imageString} alt={organization.name} />
          <OrgDetails>
            <OrgName>{organization.name}</OrgName>
            <OrgLocation>{organization.city}, {organization.state}</OrgLocation>
          </OrgDetails>
        </OrganizationInfo>
        <MoreInfoButton>
          {isOpen ? (
            <>
              Less Info <ChevronUp size={16} />
            </>
          ) : (
            <>
              More Info <ChevronDown size={16} />
            </>
          )}
        </MoreInfoButton>
      </CardHeader>
      
      <CardContent isOpen={isOpen}>
        <TagsContainer>
          {tags.map((tag, index) => (
            <Tag key={index}>{tag}</Tag>
          ))}
        </TagsContainer>
        
        <ContentGrid>
          <div>
            <SectionContainer>
              <SectionTitle>Mission Statement</SectionTitle>
              <SectionContent>
                {organization.mission_statement || 'No mission statement available.'}
              </SectionContent>
            </SectionContainer>
            
            <SectionContainer>
              <SectionTitle>Collaboration Opportunities</SectionTitle>
              <SectionContent>
                {organization.collaboration_opportunities || 'No collaboration opportunities available.'}
              </SectionContent>
            </SectionContainer>
            
            <Address>
              <SectionTitle>Address</SectionTitle>
              <SectionContent>
                {organization.street}{organization.apt ? `, ${organization.apt}` : ''}<br />
                {organization.city}, {organization.state} {organization.zipcode}
              </SectionContent>
            </Address>
            
            <ContactInfo>
              <SectionTitle>Contact Information</SectionTitle>
              <SectionContent>
                Email: <Link href={`mailto:${organization.email}`}>{organization.email}</Link><br />
                Phone: {organization.phone_number || 'N/A'}
              </SectionContent>
            </ContactInfo>
          </div>
          
          <div>
            <SectionContainer>
              <SectionTitle>Upcoming Events</SectionTitle>
              {organization.upcomingEvents.length > 0 ? (
                <EventsContainer>
                  {organization.upcomingEvents.map((event) => (
                    <EventItem key={event.id}>
                      <EventTitle>
                        {new Date(event.event_start).toLocaleDateString()} - {event.title}
                      </EventTitle>
                      <EventArrow>→</EventArrow>
                    </EventItem>
                  ))}
                </EventsContainer>
              ) : (
                <SectionContent>No upcoming events.</SectionContent>
              )}
            </SectionContainer>
            
            <SectionContainer>
              <SectionTitle>Required Forms</SectionTitle>
              <EventsContainer>
                {organization.requiredForms.map((form) => (
                  <FormItem key={form.id}>
                    <EventTitle>{form.title}</EventTitle>
                    <EventArrow>→</EventArrow>
                  </FormItem>
                ))}
              </EventsContainer>
            </SectionContainer>
          </div>
        </ContentGrid>
      </CardContent>
    </CardContainer>
  );
};

export default OrganizationCard; 