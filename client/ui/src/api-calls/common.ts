const BASE_URL = import.meta.env.VITE_SERVER_API_BASE_URL;

export class RequestService {
  baseUrl: string;
  port: number;
  headers: Headers;

  //{ baseUrl?: string, port?: number, headers?: Headers }
  constructor(args: { baseUrl?: string, port?: number, headers?: Headers } = {}) {
    this.baseUrl = args?.baseUrl || BASE_URL;
    this.port = args?.port || 3000;
    this.headers = {
      "Content-Type": "application/json",
      ...args?.headers
    } as Headers; 
  }

  _compileUrl(endpoint: string) {
    return `${this.baseUrl}:${this.port}${endpoint}`;
  }

  async get(endpoint: string, headers?: Partial<Headers>) {
    const res = await fetch(this._compileUrl(endpoint), {
      headers: {
        ...this.headers,
        ...headers
      }
    });
    return res.json();
  }

  async post(endpoint: string, body: BodyInit, headers?: Partial<Headers>) {
    const res = await fetch(this._compileUrl(endpoint), {
      headers: {
        ...this.headers,
        ...headers
      },
      method: 'POST',
      body
    })
    return res.json();
  }

  async put(endpoint: string, body: BodyInit, headers?: Partial<Headers>) {
    const res = await fetch(this._compileUrl(endpoint), {
      headers: {
        ...this.headers,
        ...headers
      },
      method: 'PUT',
      body
    })
    return res.json();
  }

  async delete(endpoint: string, headers?: Partial<Headers>) {
    const res = await fetch(this._compileUrl(endpoint), {
      headers: {
        ...this.headers,
        ...headers
      },
      method: 'DELETE'
    });
    return res.json();
  }
}