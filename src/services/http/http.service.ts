import { RouterKey } from "@/const";
import { useAccessTokenStore } from "@/store/access-token.store";
import { HttpException, type HttpExceptionBody } from "@/types";

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

export type QueryParams =
  | Record<string, string | number | boolean | null | undefined>
  | Record<string, Array<string | number | boolean>>;

interface RequestConfig<TBody = unknown> {
  method: HttpMethod;
  body?: TBody;
  params?: QueryParams;
  headers?: Record<string, string>;
  retry?: boolean;
}

interface RefreshResponse {
  accessToken: string;
}

export class HttpService {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private get accessToken(): string | undefined {
    return useAccessTokenStore.getState().accessToken;
  }

  private set accessToken(token: string | undefined) {
    const { setAccessToken, removeAccessToken } =
      useAccessTokenStore.getState();
    if (token) {
      setAccessToken(token);
    } else {
      removeAccessToken();
    }
  }

  private buildQuery(params?: QueryParams): string {
    if (!params) return "";

    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null) return;

      if (Array.isArray(value)) {
        value.forEach((v) => searchParams.append(key, String(v)));
      } else {
        searchParams.append(key, String(value));
      }
    });

    const query = searchParams.toString();
    return query ? `?${query}` : "";
  }

  private async request<TResponse, TBody = unknown>(
    url: string,
    config: RequestConfig<TBody>,
  ): Promise<TResponse> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...config.headers,
    };

    if (this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`;
    }

    const query = this.buildQuery(config.params);

    const response = await fetch(`${this.baseUrl}${url}${query}`, {
      method: config.method,
      headers,
      body: config.body ? JSON.stringify(config.body) : undefined,
      credentials: "include",
    });

    if (
      response.status === 401 &&
      !config.retry &&
      !url.includes(RouterKey.LOGIN)
    ) {
      return this.handle401<TResponse, TBody>(url, config);
    }

    const body = (
      response.headers.get("Content-Type")?.includes("application/json")
        ? await response.json()
        : await response.text()
    ) as TResponse;

    if (!response.ok) {
      throw new HttpException(response, body as HttpExceptionBody);
    }

    return body;
  }

  private async handle401<TResponse, TBody>(
    url: string,
    config: RequestConfig<TBody>,
  ): Promise<TResponse> {
    try {
      const newAccessToken = await this.refreshToken();
      this.accessToken = newAccessToken;

      return this.request<TResponse, TBody>(url, {
        ...config,
        retry: true,
      });
    } catch {
      this.accessToken = undefined;
      throw new Error("Unauthorized");
    }
  }

  private async refreshToken(): Promise<string> {
    const response = await fetch(`${this.baseUrl}/auth/refresh`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Refresh failed");
    }

    const data = (await response.json()) as RefreshResponse;
    return data.accessToken;
  }

  get<TResponse>(url: string, params?: QueryParams): Promise<TResponse> {
    return this.request<TResponse>(url, {
      method: "GET",
      params,
    });
  }

  delete<TResponse>(url: string, params?: QueryParams): Promise<TResponse> {
    return this.request<TResponse>(url, {
      method: "DELETE",
      params,
    });
  }

  post<TResponse, TBody>(
    url: string,
    body: TBody,
    params?: QueryParams,
  ): Promise<TResponse> {
    return this.request<TResponse, TBody>(url, {
      method: "POST",
      body,
      params,
    });
  }

  patch<TResponse, TBody>(
    url: string,
    body: TBody,
    params?: QueryParams,
  ): Promise<TResponse> {
    return this.request<TResponse, TBody>(url, {
      method: "PATCH",
      body,
      params,
    });
  }

  async upload<TResponse>(
    url: string,
    file: File,
    fieldName: string = "file",
    params?: QueryParams,
    options?: {
      onUploadProgress?: (progress: number) => void;
      signal?: AbortSignal;
    },
  ): Promise<TResponse> {
    const formData = new FormData();
    formData.append(fieldName, file);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const query = this.buildQuery(params);

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable && options?.onUploadProgress) {
          const progress = (event.loaded / event.total) * 100;
          options.onUploadProgress(progress);
        }
      });

      if (options?.signal) {
        options.signal.addEventListener("abort", () => {
          xhr.abort();
          reject(new Error("Upload aborted"));
        });
      }

      xhr.onload = async () => {
        try {
          const contentType = xhr.getResponseHeader("content-type") || "";
          const body = contentType.includes("application/json")
            ? JSON.parse(xhr.responseText)
            : xhr.responseText;

          if (xhr.status === 401 && !url.includes(RouterKey.LOGIN)) {
            try {
              const newAccessToken = await this.refreshToken();
              this.accessToken = newAccessToken;

              const retryResult = await this.upload<TResponse>(
                url,
                file,
                fieldName,
                params,
                options,
              );
              resolve(retryResult);
              return;
            } catch {
              this.accessToken = undefined;
              reject(new Error("Unauthorized"));
              return;
            }
          }

          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(body as TResponse);
          } else {
            reject(
              new HttpException(
                { status: xhr.status } as Response,
                body as HttpExceptionBody,
              ),
            );
          }
        } catch {
          reject(new Error("Failed to parse response"));
        }
      };

      xhr.onerror = () => {
        reject(new Error("Network error"));
      };

      xhr.open("POST", `${this.baseUrl}${url}${query}`, true);
      xhr.withCredentials = true;

      if (this.accessToken) {
        xhr.setRequestHeader("Authorization", `Bearer ${this.accessToken}`);
      }

      xhr.send(formData);
    });
  }
}

export const httpService = new HttpService(import.meta.env.VITE_API_URL);
