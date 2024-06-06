"use client";

import { useParams } from "next/navigation";

export default function Page() {
  const pathParameter: string = useParams().title.toString();
  // function formatString(input) {
  //   // Step 1: Replace hyphens with spaces
  //   const spacedString = input.replace(/-/g, ' ');
  
  //   // Step 2: Capitalize the first letter of each word
  //   const capitalizedString = spacedString.replace(/\b\w/g, char => char.toUpperCase());
  
  //   return capitalizedString;
  // }
  const title= pathParameter.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());

  return <div><h1>{title}</h1></div>;
}
