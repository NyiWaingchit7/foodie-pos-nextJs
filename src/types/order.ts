import { Addon, ORDERSTATUS, Order } from "@prisma/client";
import { AppBaseOptions } from "./app";
import { CartItem } from "./cart";

export interface OrderSlice {
  items: Order[];
  isLoading: boolean;
  error: Error | null;
}

export interface CreateOrderOptions extends AppBaseOptions {
  tableId: number;
  cartItems: CartItem[];
}

export interface UpdateOrderOptions extends AppBaseOptions {
  itemId: string;
  status: ORDERSTATUS;
}

export interface OrderAddon {
  addonCategoryId: number;
  addons: Addon[];
}

export interface OrderItem {
  itemId: string;
  status: ORDERSTATUS;
  orderAddons: OrderAddon[];
}
