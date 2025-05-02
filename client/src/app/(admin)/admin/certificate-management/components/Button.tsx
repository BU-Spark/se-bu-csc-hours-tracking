import styled from "styled-components"; 



const StyledButton = styled.button`
height : 5vh; 
color: #CC0000;
border-radius : 20px;
border: 1px solid  #e6e6e6;
background-color : #e6e6e6;
box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);
width : 7rem;
`;  
export default function Button(){
    return(
        <>
        <StyledButton>
            + Add Forms
        </StyledButton>
        
        </>
    )
}