"use client";

import { useParams } from "next/navigation";

export default function Page() {
  const pathParameter = useParams();

  return <div>My Post: {pathParameter.title}</div>;
}
