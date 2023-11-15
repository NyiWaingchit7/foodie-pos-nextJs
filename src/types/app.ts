export interface AppSlice {
  init: boolean;
  isLoading: boolean;
  error: Error | null;
}

export interface AppBaseOptions {
  onSuccess?: (data?: any) => void;
  onError?: (data?: any) => void;
}
export interface GetAppDataOptions extends AppBaseOptions {
  tableId?: number;
}
