import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";
import type { NetworkResult } from "@/types/api";
import { getErrorMessage } from "@/lib";

export const api = axios.create({
  baseURL:
    `${process.env.NEXT_PUBLIC_API_URL}/api` || "http://localhost:4000/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

const toNetworkResult = <T>(response: AxiosResponse<T>): NetworkResult<T> => ({
  state: true,
  data: response.data,
  status: response.status,
  headers: response.headers as Record<string, string>,
});

const toErrorResult = <T>(error: unknown): NetworkResult<T> => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    return {
      state: false,
      error: getErrorMessage(data ?? error.message),
      status: error.response?.status,
      headers: error.response?.headers as Record<string, string> | undefined,
    };
  }
  return {
    state: false,
    error: getErrorMessage(error),
  };
};

type RequestOptions = AxiosRequestConfig & {
  ignoreHeaders?: boolean;
};

const GET = async <T>(
  url: string,
  options: RequestOptions = {},
): Promise<NetworkResult<T>> => {
  try {
    const { ignoreHeaders, headers, ...rest } = options;
    const response = await api.get<T>(url, {
      ...rest,
      headers: ignoreHeaders ? undefined : headers,
    });
    return toNetworkResult(response);
  } catch (error) {
    return toErrorResult<T>(error);
  }
};

const POST = async <T>(
  url: string,
  body?: FormData | object,
  options: RequestOptions = {},
): Promise<NetworkResult<T>> => {
  try {
    const { ignoreHeaders, headers, ...rest } = options;
    const isFormData = body instanceof FormData;

    const response = await api.post<T>(url, body, {
      ...rest,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(ignoreHeaders ? {} : headers),
      },
    });
    return toNetworkResult(response);
  } catch (error) {
    return toErrorResult<T>(error);
  }
};

const PATCH = async <T>(
  url: string,
  body: FormData | object,
  options: RequestOptions = {},
): Promise<NetworkResult<T>> => {
  try {
    const { ignoreHeaders, headers, ...rest } = options;
    const isFormData = body instanceof FormData;

    const response = await api.patch<T>(url, body, {
      ...rest,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(ignoreHeaders ? {} : headers),
      },
    });
    return toNetworkResult(response);
  } catch (error) {
    return toErrorResult<T>(error);
  }
};

const PUT = async <T>(
  url: string,
  body: FormData | object,
  options: RequestOptions = {},
): Promise<NetworkResult<T>> => {
  try {
    const { ignoreHeaders, headers, ...rest } = options;
    const isFormData = body instanceof FormData;

    const response = await api.put<T>(url, body, {
      ...rest,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(ignoreHeaders ? {} : headers),
      },
    });
    return toNetworkResult(response);
  } catch (error) {
    return toErrorResult<T>(error);
  }
};

const DELETE = async <T>(
  url: string,
  body?: object,
  options: RequestOptions = {},
): Promise<NetworkResult<T>> => {
  try {
    const { ignoreHeaders, headers, ...rest } = options;

    const response = await api.delete<T>(url, {
      ...rest,
      data: body,
      headers: {
        "Content-Type": "application/json",
        ...(ignoreHeaders ? {} : headers),
      },
    });
    return toNetworkResult(response);
  } catch (error) {
    return toErrorResult<T>(error);
  }
};

export { GET, POST, PATCH, PUT, DELETE };
