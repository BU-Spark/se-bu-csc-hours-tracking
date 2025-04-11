"use client";

import { useParams } from "next/navigation";

export default function Page() {
  //get path and format into title
  const params = useParams();
  const titleParam = params?.title;
  const pathParameter = Array.isArray(titleParam) ? titleParam[0] : titleParam || '';
  const title = pathParameter.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());

  return <div><h3>{title}</h3></div>;
}
