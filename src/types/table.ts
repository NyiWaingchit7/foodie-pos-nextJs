import { Table } from "@prisma/client";
import { AppBaseOptions } from "./app";

export interface TableSlice {
  items: Table[];
  isLoading: boolean;
  error: Error | null;
}

export interface UpdateTableOptions extends AppBaseOptions {
  id: number;
  name: string;
  locationId: number;
}

export interface DeleteTableOptions extends AppBaseOptions {
  id: number;
}

export interface CreateTableOptions extends AppBaseOptions {
  name: string;
  locationId?: number;
}
