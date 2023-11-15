// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { prisma } from "@/utils/db";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;
  if (method === "POST") {
    //check is user login?
    const session = await getServerSession(req, res, authOptions);
    if (!session) return res.status(401).send("unauthorized");
    const user = session.user;
    const email = user?.email as string;
    //db user
    const dbUser = await prisma.user.findUnique({ where: { email } });
    if (!dbUser) return res.status(401).send("Unauthorized");
    //get company id
    const companyId = dbUser.companyId;
    //data validate
    const { name, address } = req.body;
    const isValidate = name && address;
    if (!isValidate) return res.status(400).send("bad request");
    // create new location
    const newLocation = await prisma.location.create({
      data: { name, address, companyId },
    });
    return res.status(200).send(newLocation);
  }

  res.status(405).send("method not allowed");
}
