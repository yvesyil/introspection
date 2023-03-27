import { RequestService } from "./common";

const requester = new RequestService();

export async function getCompilers() {
  return await requester.get('/api/compilers');
}
