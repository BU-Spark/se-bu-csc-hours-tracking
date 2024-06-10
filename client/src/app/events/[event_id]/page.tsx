"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getEvent } from "./action";
import { Event } from "@/interfaces/interfaces";

export default function Page() {
  const [event, setEvent] = useState<Event>();
  const event_id: string = useParams().event_id.toString();

  useEffect(() => {
    const fetchEvent = async () => {
      const response = await getEvent(Number(event_id));
      if (response) {
        setEvent(response);
      }
    };
    fetchEvent();
  }, [event_id]);
  return event ? <>{event.description}</> : <p>Loading...</p>;
}
