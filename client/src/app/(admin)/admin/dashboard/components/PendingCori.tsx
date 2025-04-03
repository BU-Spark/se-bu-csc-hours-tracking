
import { Card } from 'antd';


type PendingHourCardProps = {
    classYear : number; 
    college : string; 
    name: string;
    category: string;
    dateRequested: string;
    profilePic : string; 
  };

export default function PendingCori({name, classYear, college, category, dateRequested, profilePic} : PendingHourCardProps){
    const year = classYear.toString().slice(-2) + "'"; 
    const userYear = college.toUpperCase() + " " + year; 
    return(
        <Card 
            style={{ 
                marginTop: "1.25rem",  
                width: "clamp(12rem, 30vw, 18rem)",
                backgroundColor: '#EBEBEB', 
                color: 'black', 
                borderRadius: "1.5625rem", 
            }} 
            title={
            <div style={{ display: 'flex', flexDirection: 'row', marginTop: "0.1875rem" }}> 
                <img 
                    src= {profilePic}
                    style={{ 
                        height: "clamp(2.5rem, 5vw, 3rem)",  
                        width: "clamp(2.5rem, 5vw, 3rem)",
                        borderRadius: "50%" 
                    }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', marginLeft: "0.625rem" }}>  
                    <span style={{ color:'black', fontSize: "clamp(0.8rem, 1.5vw, 1rem)" }}>{name}</span>
                    <span style={{ fontSize: "clamp(0.656rem, 1.3vw, 0.75rem)", color:'black' }}>{year}</span> 
                </div>
            </div>}
            styles={{
                body: {
                    backgroundColor: '#CC0000',
                    color: 'white', 
                    borderBottomLeftRadius: "1.5625rem",  
                    borderBottomRightRadius: "1.5625rem",
                }, 
                header: {
                    borderTopLeftRadius: "1.5625rem",
                    borderTopRightRadius: "1.5625rem",
                    height: "4.6875rem", 
                    marginLeft: "-0.9375rem"  
                }, 
            }}
        >
            <div style={{ marginTop: "-1.875rem", marginBottom: "-0.9375rem" }}> 
                <ul style={{ 
                    marginLeft: "-3.125rem",  
                    listStyle: 'none', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: "0.3125rem" 
                }}>
                    <li><strong>Category: </strong>{category}</li>
                    <li><strong>Date Requested: </strong>{dateRequested}</li>
                    <a 
                        href="#" 
                        style={{ 
                            marginTop: "0.3125rem",
                            textDecoration: 'underline', 
                            color: "white", 
                            fontWeight: "bold",
                            fontSize: "clamp(0.8rem, 1.5vw, 1rem)"
                        }}
                    >
                        Full Profile
                    </a>
                </ul>
            </div>
        </Card>
    )

    

}

