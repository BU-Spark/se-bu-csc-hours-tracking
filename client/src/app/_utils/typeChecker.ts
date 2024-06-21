import { HoursTableData } from "@/interfaces/interfaces";
import { HourSubmission, Person } from "@prisma/client";

function isPerson(data: any): data is Person {
  return typeof data.id === 'string' && typeof data.name === 'string';
}

function isHourSubmission(data: any): data is HourSubmission {
  return typeof data.hours === 'number' && typeof data.date === 'string';
}

function isEvent(data: any): data is Event {
  return typeof data.eventId === 'string' && typeof data.eventName === 'string';
}

export function isHoursTableData(data: any): data is HoursTableData {
  return (
    typeof data.submissionId === 'string' &&
    isPerson(data.requester) &&
    isHourSubmission(data.hourSubmission) &&
    isEvent(data.event)
  );
}
