import { Http, HttpResponse, HttpOptions } from '@capacitor-community/http';

export class HTTPClient {
    public static async get<T>(url: string, options: Omit<HttpOptions, 'url' | 'method'> = {}): Promise<HttpResponse> {
        const defaultOptions: Omit<HttpOptions, 'url' | 'method'> = {
            params: {},
            headers: {},
        };

        const requestOptions: HttpOptions = {
            ...defaultOptions,
            ...options,
            method: 'GET',
            url: url,
        };

        return Http.request(requestOptions);
    }

    public static async post<T>(url: string, data: any, options: Omit<HttpOptions, 'url' | 'method' | 'data'> = {}): Promise<HttpResponse> {
        const defaultOptions: Omit<HttpOptions, 'url' | 'method' | 'data'> = {
            params: {},
            headers: {},
        };

        const requestOptions: HttpOptions = {
            ...defaultOptions,
            ...options,
            method: 'POST',
            url: url,
            data: data,
        };

        return Http.request(requestOptions);
    }
}
