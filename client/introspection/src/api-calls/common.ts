const BASE_URL = import.meta.env.VITE_SERVER_API_BASE_URL;

export class RequestService {
  baseUrl: string;
  headers: Headers;

  constructor(baseUrl?: string, headers?: Headers) {
    this.baseUrl = baseUrl || BASE_URL;
    this.headers = {
      "Content-Type": "application/json",
      ...headers
    } as Headers; 
  }

  async get(endpoint: string, headers?: Partial<Headers>) {
    const res = await fetch(this.baseUrl + endpoint, {
      headers: {
        ...this.headers,
        ...headers
      }
    });
    return res.json();
  }

  async post(endpoint: string, body: BodyInit, headers?: Partial<Headers>) {
    const res = await fetch(this.baseUrl + endpoint, {
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
    const res = await fetch(this.baseUrl + endpoint, {
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
    const res = await fetch(this.baseUrl + endpoint, {
      headers: {
        ...this.headers,
        ...headers
      },
      method: 'DELETE'
    });
    return res.json();
  }
}