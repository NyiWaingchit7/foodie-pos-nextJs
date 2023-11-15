import { Location } from "@prisma/client";
import { AppBaseOptions } from "./app";

export interface LocationSlice {
  items: Location[];
  selectedLocation: Location | null;
  isLoading: boolean;
  error: Error | null;
}

export interface CreateNewLocationOptions extends AppBaseOptions {
  name: string;
  address: string;
}
