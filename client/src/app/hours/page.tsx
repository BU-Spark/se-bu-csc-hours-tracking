"use client";

import React from 'react';
import styled from 'styled-components';
import CustomSider from '../../components/Sider/CustomSider';
import CustomHeader from '../../components/Header/CustomHeader';

const Container = styled.div`
  display: flex;
`;

const MainContent = styled.div`
  margin-left: 250px; 
  padding: 20px;
  width: 100%;
`;

const HeaderOffset = styled.div`
  margin-top: 70px; 
`;

const HoursSummary = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
`;

const HoursBox = styled.div`
  text-align: center;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

const FilterButtons = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  button {
    margin: 0 10px;
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    background-color: #ccc;
    cursor: pointer;
    &:hover {
      background-color: #bbb;
    }
  }
`;

const HoursList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const HoursItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 20px;
  }
`;

const MyHours: React.FC = () => {
  return (
    <Container>
      <CustomSider />
      <MainContent>
        <CustomHeader />
        <HeaderOffset>
          <h1>My Hours</h1>
          <HoursSummary>
            <HoursBox>
              <h2>4</h2>
              <p>Approved</p>
              <button>View more</button>
            </HoursBox>
            <HoursBox>
              <h2>2</h2>
              <p>Pending</p>
              <button>View more</button>
            </HoursBox>
            <HoursBox>
              <h2>6</h2>
              <p>Submitted</p>
              <button>View more</button>
            </HoursBox>
          </HoursSummary>
          <FilterButtons>
            <button>This Month</button>
            <button>This Year</button>
            <button>Cumulative</button>
          </FilterButtons>
          <HoursList>
            <HoursItem>
              <img src="/farm_table.png" alt="Farm to Table" />
              <div>
                <p>Farm to Table</p>
                <p>5 Hours - Rocky Hill Farm - Approved - 12/13/2023 - Reviewed by: Alex</p>
              </div>
            </HoursItem>
            <HoursItem>
              <img src="/beach-cleanup.png" alt="Beach Cleanup" />
              <div>
                <p>Beach Cleanup</p>
                <p>4 Hours - Revere Beach - Approved - 12/17/2023 - Reviewed by: Alex</p>
              </div>
            </HoursItem>
            <HoursItem>
              <img src="/clothing.png" alt="Clothing Drive" />
              <div>
                <p>Clothing Drive</p>
                <p>1 Hour - George Sherman Union - Approved - 02/05/2024 - Reviewed by: Alex</p>
              </div>
            </HoursItem>
            <HoursItem>
              <img src="/boy-girl.png" alt="Boys & Girls Club" />
              <div>
                <p>Boys & Girls Club</p>
                <p>2 Hours - Harvard Yard - Pending - 03/10/2024 - Reviewed by: Stella</p>
              </div>
            </HoursItem>
            <HoursItem>
              <img src="/market.png" alt="Mobile Market" />
              <div>
                <p>Mobile Market</p>
                <p>5 Hours - Newbury St - Approved - 03/15/2024 - Reviewed by: Admin</p>
              </div>
            </HoursItem>
          </HoursList>
        </HeaderOffset>
      </MainContent>
    </Container>
  );
};

export default MyHours;
