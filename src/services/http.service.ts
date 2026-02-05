import { HttpException, type HttpExceptionBody } from "@/types/exception.type";

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

type QueryParams =
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

class HttpService {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private get accessToken(): string | null {
    return localStorage.getItem("accessToken");
  }

  private set accessToken(token: string | null) {
    if (token) {
      localStorage.setItem("accessToken", token);
    } else {
      localStorage.removeItem("accessToken");
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

    if (response.status === 401 && !config.retry) {
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
      this.accessToken = null;
      throw new Error("Unauthorized");
    }
  }

  private async refreshToken(): Promise<string> {
    const response = await fetch(`${this.baseUrl}/auth/refresh`, {
      method: "POST",
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
}

export const httpService = new HttpService(import.meta.env.VITE_API_URL);
