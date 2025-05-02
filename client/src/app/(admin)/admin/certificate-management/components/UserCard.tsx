"use client";
import styled from "styled-components"; 

type UserPropsType = {
    name : string;
    submissionDate : string;
}

const CardContainer =  styled.div`
display : flex;
flex-direction : column;
width: 17.5rem;
border : 3px solid #CC0000;
border-radius: 20px;
height : 65px;
margin-top : 1rem;
`; 

const UserName = styled.h1`
font-size: 1.25rem;
margin-left: 1rem;
`;

const Date = styled.p`
margin-left : 1rem;
margin-top : -0.5rem;
color : gray; 
font-size : 0.75rem;
`; 
export default function UserCard({name, submissionDate} : UserPropsType){
    return (
        <CardContainer>
            <UserName>{name}</UserName>
            <Date>{submissionDate}</Date>
        </CardContainer>
    )

}