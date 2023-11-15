// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { prisma } from "@/utils/db";
import { CreateAddonOptions, UpdateAddonOptions } from "@/types/addon";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //check is user login?
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).send("unauthorized");
  const method = req.method;

  if (method === "POST") {
    //data validation
    const { name, price, addonCategoryId } = req.body as CreateAddonOptions;
    const isValidate = name && addonCategoryId;
    if (!isValidate) return res.status(400).send("bad request");

    //create new
    const newAddon = await prisma.addon.create({
      data: { name, price, addonCategoryId },
    });

    return res.status(200).send(newAddon);
  } else if (method === "PUT") {
    //get data from request
    const { id, name, price, addonCategoryId } = req.body as UpdateAddonOptions;
    console.log(id, name, price, addonCategoryId);

    //data validation
    const validate = id && name && price !== undefined && addonCategoryId;
    if (!validate) return res.status(400).send("bad request no data");
    const exist = await prisma.addon.findFirst({ where: { id } });
    if (!exist) return res.status(400).send("bad request");

    //update
    const addon = await prisma.addon.update({
      where: { id },
      data: { name, price, addonCategoryId },
    });

    return res.status(200).send(addon);
  } else if (method === "DELETE") {
    const addonId = Number(req.query.id);
    const addon = await prisma.menu.findFirst({ where: { id: addonId } });
    if (!addon) return res.status(400).send("bad request");
    await prisma.addon.update({
      where: { id: addonId },
      data: { isArchived: true },
    });
    return res.send("deleted");
  }

  res.status(405).send("method not allowed");
}
