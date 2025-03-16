"use client";
import PendingCard from '../dashboard/PendingCard'

export default function Dashboard(){
    const people = [
        {name : "Sam Crissman", year : "CAS 26'", category: "SFR", hours : 4, date: "03/25/2024"}, 
        {name : "Alex Smith", year : "CAS 25'", category : "SFR", hours : 5, date : "03/26/2924"}, 
        {name : "Jamie Doe", year : "CAS 27'",category: "SFR", hours : 3, date : "03/24/2024"} 
    ]
    return(

        <>
        <h1 style={{ fontSize: "clamp(1.2rem, 2vw, 2rem)" }}>Dashboard</h1>
        <div>
            <strong style={{ fontSize: "clamp(1rem, 1.5vw, 1.3rem)" }}>
            Pending Hour Approvals
            </strong>
        </div>
        <div style ={{display:'flex', flexDirection : 'row', gap : '15px'}}>
            {people.map((person, index) => (
                <PendingCard key = {index} year = {person.year} name = {person.name} category = {person.category} hours = {person.hours} date = {person.date}
                profilePic = {"https://i.pravatar.cc/40?img=" + (index + 1)}/>
            ))
            }
        </div>
        </>
    );
}
