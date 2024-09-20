"use client";

import { useParams } from "next/navigation";

export default function Page() {
  //get path and format into title
  const pathParameter: string = useParams().title.toString();
  const title= pathParameter.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());

  return <div><h3>{title}</h3></div>;
}
