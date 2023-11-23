import { Addon, Menu, ORDERSTATUS, Order, Table } from "@prisma/client";
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
export interface RefreshOrderOptions extends AppBaseOptions {
  orderSeq: string;
}

export interface OrderItem {
  itemId: string;
  status: ORDERSTATUS;
  orderAddons: OrderAddon[];
  menu: Menu;
  table: Table;
}
