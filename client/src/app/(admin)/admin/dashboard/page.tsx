"use client";
import { Card } from 'antd';

export default function Dashboard(){
    return(
        <>
        <h1 style={{ fontSize: "clamp(1.2rem, 2vw, 2rem)" }}>Dashboard</h1>
        <div>
            <strong style={{ fontSize: "clamp(1rem, 1.5vw, 1.3rem)" }}>
            Pending Hour Approvals
            </strong>
        </div>

        <Card 
            style={{ 
                marginTop: "1.25rem",  
                width: "clamp(12rem, 30vw, 18rem)",
                backgroundColor: '#CC0000', 
                color: 'white', 
                borderRadius: "1.5625rem", 
                border: "0.125rem solid #CC0000"  
            }} 
            title={
            <div style={{ display: 'flex', flexDirection: 'row', marginTop: "0.1875rem" }}> 
                <img 
                    src="https://i.pravatar.cc/40" 
                    style={{ 
                        height: "clamp(2.5rem, 5vw, 3rem)",  
                        width: "clamp(2.5rem, 5vw, 3rem)",
                        borderRadius: "50%" 
                    }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', marginLeft: "0.625rem" }}>  
                    <span style={{ color:'white', fontSize: "clamp(0.8rem, 1.5vw, 1rem)" }}>Sam Crissman</span>
                    <span style={{ fontSize: "clamp(0.656rem, 1.3vw, 0.75rem)", color:'white' }}>CAS 26'</span> 
                </div>
            </div>}
            styles={{
                body: {
                    backgroundColor: 'white',
                    color: 'black', 
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
                    <li><strong>Category: </strong>SFR</li>
                    <li><strong>Hours: </strong>4</li>
                    <li><strong>Date: </strong>03/25/2024</li>
                    <a 
                        href="#" 
                        style={{ 
                            marginTop: "0.3125rem",
                            textDecoration: 'underline', 
                            color: "#CC0000", 
                            fontWeight: "bold",
                            fontSize: "clamp(0.8rem, 1.5vw, 1rem)"
                        }}
                    >
                        Full Profile
                    </a>
                </ul>
            </div>
        </Card>
        </>
    );
}
