// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { prisma } from "@/utils/db";
import { CreateMenuOptions } from "@/types/menu";

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
    const { name, price, menuCategoryId, assetUrl } =
      req.body as CreateMenuOptions;
    const isValidate = name && menuCategoryId;
    if (!isValidate) return res.status(400).send("bad request");

    //create new
    const newMenu = await prisma.menu.create({
      data: { name, price, assetUrl },
    });

    const newMenuCategoryMenu: { menuCategoryId: number; menuId: number }[] =
      menuCategoryId.map((item: number) => ({
        menuCategoryId: item,
        menuId: newMenu.id,
      }));
    const newMenuCategoryMenus = await prisma.$transaction(
      newMenuCategoryMenu.map((item) =>
        prisma.menuCategoryMenu.create({
          data: { menuCategoryId: item.menuCategoryId, menuId: item.menuId },
        })
      )
    );

    return res.status(200).json({ newMenu, newMenuCategoryMenus });
  } else if (method === "PUT") {
    const { id, name, price, menuCategoryIds, locationId, isAvailable } =
      req.body;
    const isValid =
      id && name && price !== undefined && menuCategoryIds.length > 0;
    if (!isValid) return res.status(400).send("Bad request.");
    const menu = await prisma.menu.update({
      data: { name, price },
      where: { id },
    });
    // update menuCategoryMenu table
    await prisma.menuCategoryMenu.deleteMany({ where: { menuId: id } });
    const menuCategoryMenusData: { menuId: number; menuCategoryId: number }[] =
      menuCategoryIds.map((item: number) => ({
        menuId: id,
        menuCategoryId: item,
      }));
    const menuCategoryMenus = await prisma.$transaction(
      menuCategoryMenusData.map((item) =>
        prisma.menuCategoryMenu.create({
          data: item,
        })
      )
    );

    if (locationId && isAvailable === false) {
      const exist = await prisma.disabledLocationMenu.findFirst({
        where: { menuId: id, locationId },
      });
      if (!exist) {
        await prisma.disabledLocationMenu.create({
          data: { locationId, menuId: id },
        });
      }
    } else if (locationId && isAvailable === true) {
      const exist = await prisma.disabledLocationMenu.findFirst({
        where: { menuId: id, locationId },
      });
      if (exist) {
        await prisma.disabledLocationMenu.delete({
          where: { id: exist.id },
        });
      }
    }
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user?.email as string },
    });
    const allMenuCategoryIds = (
      await prisma.menuCategory.findMany({
        where: { companyId: dbUser?.companyId },
      })
    ).map((item) => item.id);
    const menuIds = (
      await prisma.menuCategoryMenu.findMany({
        where: { menuCategoryId: { in: allMenuCategoryIds } },
      })
    ).map((item) => item.menuId);
    const disabledLocationMenus = await prisma.disabledLocationMenu.findMany({
      where: { menuId: { in: menuIds } },
    });
    return res
      .status(200)
      .json({ menu, menuCategoryMenus, disabledLocationMenus });
  } else if (method === "DELETE") {
    const menuId = Number(req.query.id);
    const menu = await prisma.menu.findFirst({ where: { id: menuId } });
    if (!menu) return res.status(400).send("Bad request.");
    await prisma.menuAddonCategory.updateMany({
      data: { isArchived: true },
      where: { menuId },
    });
    const menuAddonCategoriesRow = await prisma.menuAddonCategory.findMany({
      where: { menuId },
    });
    const addonCategoryIds = menuAddonCategoriesRow.map(
      (item) => item.addonCategoryId
    );

    await prisma.menu.update({
      data: { isArchived: true },
      where: { id: menuId },
    });
    return res.status(200).send("Deleted.");
  }

  res.status(405).send("method not allowed");
}
