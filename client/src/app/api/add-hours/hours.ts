import { NextApiRequest, NextApiResponse } from "next";
import { getHourSubmissionsByUserEmail } from "../../my-hours/action";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { email } = req.query;

  if (!email || typeof email !== "string") {
    res.status(400).json({ error: "Invalid email parameter" });
    return;
  }

  try {
    const hours = await getHourSubmissionsByUserEmail(email);
    res.status(200).json(hours);
  } catch (error) {
    console.error("Error fetching hours:", error);
    res.status(500).json({ error: "Error fetching hours" });
  }
};
