import { NextApiRequest, NextApiResponse } from "next";
import { getHoursByUserEmail } from "../action";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { email } = req.query;

  if (!email || typeof email !== "string") {
    res.status(400).json({ error: "Invalid email parameter" });
    return;
  }

  try {
    const hours = await getHoursByUserEmail(email);
    res.status(200).json(hours);
  } catch (error) {
    console.error("Error fetching hours:", error);
    res.status(500).json({ error: "Error fetching hours" });
  }
};
