"use client";
import UserCard from "./components/UserCard";
import styled from "styled-components"; 
import Button from "./components/Button";
export default function CertificateManagement(){


    const Container = styled.div`
    display: flex;
    flex-direction : row;
    gap : 5em;
    `;

    const CoriForms = styled.div`
    display: flex; 
    flex-direction: column;
    `; 

    const VolunteerForms = styled.div`
    display: flex; 
    flex-direction: column;
    `; 

    const ViewAddForm = styled.div`
    display : flex;
    flex-direction : column; 
    gap:2rem;
    `;

    const ViewForm = styled.button`
    display:flex;
    flex-direction:column; 
    background-color : #e6e6e6;
    width : 12rem;
    height: 15vh;
    border-radius: 10px; 
    border: 1px;
    align-items: center; 
    justify-content:center;
    overflow-wrap: break-word;
    word-wrap: break-word;
    white-space: normal;
    gap : 1rem;
    `;

    const Text = styled.div`
    max-width :10rem;
    `;


    const mockUserData = [
        {
            name : "Ricky Shi", 
            submissionDate : "Feb 28, 2024"
        }, 
        {
            name : "Ellie Kwon", 
            submissionDate : "Feb 28, 2024" 
        }, 
        {
            name: "Liuxuan Xu",
            submissionDate : "Feb 28, 2024"
        },
        {
            name: "Thomas Xu",
            submissionDate : "Feb 28, 2024"
        },
        {
            name: "Chloe Lee",
            submissionDate : "Feb 28, 2024"
        }];

    return(
        <>
            <h1>Certification Management</h1>
            <Container>

                <CoriForms>
                <strong>Cori Forms</strong>
                {mockUserData.map((user, index) => 
                <UserCard key = {index} name= {user.name} submissionDate = {user.submissionDate}/>)}
                </CoriForms>

                <VolunteerForms>
                <strong>Volunteer Agreement Forms</strong>
                {mockUserData.map((user, index) => 
                <UserCard key = {index} name= {user.name} submissionDate = {user.submissionDate}/>)}
                </VolunteerForms>

                <ViewAddForm>
                    <Button/>
                    <ViewForm>
                        <Text>View All Signed CORI</Text>
                    </ViewForm>

                    <ViewForm>
                        <Text>View All Signed Volunteer Agreement Forms</Text>
                    </ViewForm>

                    <ViewForm>
                        <Text>View All Other Forms</Text>
                    </ViewForm>

                </ViewAddForm>

            </Container>
        </>
    )
}