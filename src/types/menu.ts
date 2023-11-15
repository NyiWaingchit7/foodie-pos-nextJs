import { Menu } from "@prisma/client";

export interface MenuSliceType {
  items: Menu[];
  isLoading: boolean;
  error: Error | null;
}

export interface BaseOptions {
  onSuccess?: (data?: any) => void;
  onError?: (data?: any) => void;
}

export interface GetMenuOptions extends BaseOptions {
  locationId: string;
}

export interface CreateMenuOptions extends BaseOptions {
  name: string;
  price: number;
  menuCategoryId: number[];
  assetUrl?: string;
}

export interface UpdateMenuOptions extends BaseOptions {
  id: number;
  name: string;
  price: number;
  menuCategoryIds: number[];
  isAvailable: boolean;
  locationId: number;
}
export interface DeleteMenuOptions extends BaseOptions {
  id: number;
}
