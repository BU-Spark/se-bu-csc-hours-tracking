"use client";
import React, { useEffect, useState } from "react";
import { Event } from "@prisma/client";
import { useSession } from "next-auth/react";
import {
    getEventsByOrganizerId,
    getOrganizationByUserId,
} from "../my-events/action";

const Dashboard: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [organizationId, setOrganizationId] = useState<number>(0);
    const { data: session } = useSession();
  
		useEffect(() => {
			const fetchEvents = async () => {
				const userId = session?.user.id;
				if (userId){
					const orgId = await getOrganizationByUserId(Number(userId));
					const eventResult = await getEventsByOrganizerId(Number(orgId));
					setEvents(eventResult);
					console.log(eventResult);
				}
    
			};
			fetchEvents();
		}, [session]);
  
    return (
      <div>third party dashboard</div>
    );
  };

export default Dashboard;
