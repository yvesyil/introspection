import { RequestService } from "./common";

const requester = new RequestService();

export type CompilerObject = {
  id: number,
  name: string,
  version: string,
  languages: number[]
}

export async function getCompilers(): Promise<CompilerObject[]> {
  return await requester.get('/api/compilers');
}
