import { RequestService } from "./common";

const requester = new RequestService();

export type UserCredentialsObject = {
  email: string,
  password: string
}

export async function login(body: UserCredentialsObject) {
  return await requester.post('/api/login', JSON.stringify(body));
}