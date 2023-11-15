// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { prisma } from "@/utils/db";
import { UpdateMenuCategoryOptions } from "@/types/menuCategory";

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
    const { name, locationId } = req.body;
    const isValidate = name && locationId;
    if (!isValidate) return res.status(400).send("bad request");
    // get current location
    const location = await prisma.location.findFirst({
      where: { id: locationId },
    });
    if (!location) return res.status(400).send("bad request");
    //create new menucategory
    const newMenuCategory = await prisma.menuCategory.create({
      data: { name, companyId: location.companyId },
    });
    return res.status(200).send(newMenuCategory);
  } else if (method === "PUT") {
    const { id, name, locationId, isAvaialble } = req.body;
    console.log(isAvaialble);

    const isValid = id && name;
    if (!isValid) return res.status(400).send("Bad request.");
    const exist = await prisma.menuCategory.findFirst({
      where: { id },
    });
    if (!exist) return res.status(400).send("Bad request.");
    const menuCategory = await prisma.menuCategory.update({
      data: { name },
      where: { id },
    });
    if (locationId && isAvaialble === false) {
      const exist = await prisma.disabledLocationMenuCategory.findFirst({
        where: { menuCategoryId: id, locationId },
      });
      if (!exist) {
        await prisma.disabledLocationMenuCategory.create({
          data: { locationId, menuCategoryId: id },
        });
      }
    } else if (locationId && isAvaialble === true) {
      const exist = await prisma.disabledLocationMenuCategory.findFirst({
        where: { menuCategoryId: id, locationId },
      });
      if (exist) {
        await prisma.disabledLocationMenuCategory.delete({
          where: { id: exist.id },
        });
      }
    }
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user?.email as string },
    });
    const menuCategoryIds = (
      await prisma.menuCategory.findMany({
        where: { companyId: dbUser?.companyId },
      })
    ).map((item) => item.id);
    const disabledLocationMenuCategory =
      await prisma.disabledLocationMenuCategory.findMany({
        where: { menuCategoryId: { in: menuCategoryIds } },
      });
    return res.status(200).json({ menuCategory, disabledLocationMenuCategory });
  } else if (method === "DELETE") {
    const menuCategoryId = Number(req.query.id);
    const menuIds = (
      await prisma.menuCategoryMenu.findMany({
        where: { menuCategoryId, isArchived: false },
      })
    ).map((item) => item.menuId);
    const menuIdsPromise = menuIds.map(async (menuId) => {
      const menuData = { menuId, count: 1 };
      const count = await prisma.menuCategoryMenu.count({
        where: { menuId, isArchived: false },
      });
      menuData.count = count;
      return menuData;
    });
    const menuIdsToArchive = (await Promise.all(menuIdsPromise))
      .filter((item) => item.count === 1)
      .map((item) => item.menuId);

    const addonCategoryIds = (
      await prisma.menuAddonCategory.findMany({
        where: { menuId: { in: menuIdsToArchive }, isArchived: false },
      })
    ).map((item) => item.addonCategoryId);

    const addonCategoryIdsPromise = addonCategoryIds.map(
      async (addonCategoryId) => {
        const addonCategoryMenuIds = (
          await prisma.menuAddonCategory.findMany({
            where: {
              addonCategoryId,
              isArchived: false,
            },
          })
        ).map((item) => item.menuId);
        return addonCategoryMenuIds.every((item) =>
          menuIdsToArchive.includes(item)
        )
          ? addonCategoryId
          : undefined;
      }
    );

    const addonCategoryIdsToArchive = (
      await Promise.all(addonCategoryIdsPromise)
    ).filter((item) => item !== undefined);

    for (const menuId of menuIdsToArchive) {
      await prisma.menu.updateMany({
        data: { isArchived: true },
        where: { id: menuId },
      });
      await prisma.menuAddonCategory.updateMany({
        data: { isArchived: true },
        where: { menuId },
      });
    }
    for (const addonCategoryId of addonCategoryIdsToArchive) {
      await prisma.addonCategory.updateMany({
        data: { isArchived: true },
        where: { id: addonCategoryId },
      });
      await prisma.addon.updateMany({
        data: { isArchived: true },
        where: { addonCategoryId },
      });
    }
    for (const menuId of menuIds) {
      await prisma.menuCategoryMenu.updateMany({
        data: { isArchived: true },
        where: { menuId, menuCategoryId },
      });
    }
    await prisma.menuCategory.update({
      data: { isArchived: true },
      where: { id: menuCategoryId },
    });
    return res.status(200).send("Deleted.");
  }

  res.status(405).send("method not allowed");
}
