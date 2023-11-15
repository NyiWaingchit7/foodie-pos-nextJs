// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { prisma } from "@/utils/db";
import { CreateMenuOptions } from "@/types/menu";
import {
  CreateAddonCategoryOptions,
  UpdateAddonCategoryOptions,
} from "@/types/addonCategory";

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
    const { name, menuIds, isRequired } =
      req.body as CreateAddonCategoryOptions;
    const isValidate = name && menuIds;
    if (!isValidate) return res.status(400).send("bad request");

    //create new
    const newAddonCategory = await prisma.addonCategory.create({
      data: { name, isRequired },
    });

    const newMenuAddonCategoryData: {
      menuId: number;
      addonCategoryId: number;
    }[] = menuIds.map((item: number) => ({
      menuId: item,
      addonCategoryId: newAddonCategory.id,
    }));

    const newMenuAddonCategory = await prisma.$transaction(
      newMenuAddonCategoryData.map((item) =>
        prisma.menuAddonCategory.create({
          data: { menuId: item.menuId, addonCategoryId: item.addonCategoryId },
        })
      )
    );

    return res.status(200).json({ newAddonCategory, newMenuAddonCategory });
  } else if (method === "PUT") {
    //get data from request
    const { id, name, isRequired, menuIds } =
      req.body as UpdateAddonCategoryOptions;
    //data validation
    const validate = id && name && menuIds.length > 0;
    if (!validate) return res.status(400).send("bad request");
    //updateMenu
    const addonCategory = await prisma.addonCategory.update({
      where: { id },
      data: { name, isRequired },
    });
    //delete old
    await prisma.menuAddonCategory.deleteMany({
      where: { addonCategoryId: id },
    });
    //update menuCategoryMenu
    const menuAddonCategoryData: { addonCategoryId: number; menuId: number }[] =
      menuIds.map((item: number) => ({
        addonCategoryId: id,
        menuId: item,
      }));
    const menuAddonCategories = await prisma.$transaction(
      menuAddonCategoryData.map((item) =>
        prisma.menuAddonCategory.create({
          data: item,
        })
      )
    );

    return res.status(200).json({ addonCategory, menuAddonCategories });
  } else if (method === "DELETE") {
    const addonCategoryId = Number(req.query.id);
    const addonCategory = await prisma.menu.findFirst({
      where: { id: addonCategoryId },
    });
    if (!addonCategory) return res.status(400).send("bad request");
    await prisma.addonCategory.update({
      where: { id: addonCategoryId },
      data: { isArchived: true },
    });
    return res.send("deleted");
  }

  res.status(405).send("method not allowed");
}
