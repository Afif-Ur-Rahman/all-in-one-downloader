export type NetworkResult<T> =
  | {
      state: true;
      data: T;
      headers?: Headers | Record<string, string>;
      status?: number;
    }
  | {
      state: false;
      error: string;
      headers?: Headers | Record<string, string>;
      status?: number;
    };

export type ActionSuccessState<T> = {
  state: true;
  data: T;
};

export type ActionErrorState = {
  state: false;
  error: string;
};

export type ActionResult<T> = ActionSuccessState<T> | ActionErrorState;

export type GetOptions = {
  headers?: Record<string, string>;
  ignoreHeaders?: boolean;
  next?: NextFetchRequestConfig;
  [key: string]: unknown;
};
