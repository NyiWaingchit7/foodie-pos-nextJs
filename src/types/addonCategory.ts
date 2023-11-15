import { AddonCategory } from "@prisma/client";

export interface AddonCategorySliceType {
  items: AddonCategory[];
  isLoading: boolean;
  error: Error | null;
}

export interface BaseOptions {
  onSuccess?: (data?: any) => void;
  onError?: (data?: any) => void;
}

export interface GetAddonCategoryOptions extends BaseOptions {
  locationId: string;
}
export interface CreateAddonCategoryOptions extends BaseOptions {
  name: string;
  isRequired: boolean;
  menuIds: number[];
}
export interface UpdateAddonCategoryOptions extends BaseOptions {
  id: number;
  name: string;
  menuIds: number[];
  isRequired: boolean;
}
export interface DeleteAddonCategoryOptions extends BaseOptions {
  id: number;
}
