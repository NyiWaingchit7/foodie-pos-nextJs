import { MenuCategory } from "@prisma/client";

export interface MenuCategorySliceType {
  items: MenuCategory[];
  isLoading: boolean;
  error: Error | null;
}

export interface BaseOptions {
  onSuccess?: (data?: any) => void;
  onError?: (data?: any) => void;
}

export interface CreateMenuCategoryOptions extends BaseOptions {
  name: string;
  locationId: number;
}
export interface UpdateMenuCategoryOptions extends BaseOptions {
  id: number;
  name: string;
  locationId: number;
  isAvaialble: boolean;
}
export interface DeleteMenuCategoryOptions extends BaseOptions {
  id: number;
}
