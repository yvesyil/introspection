import { RequestService } from "./common";
import { FileObject } from "./file-service";

const requester = new RequestService();

export type CompilerObject = {
  id: number,
  name: string,
  version: string,
  languages: number[],
}

export type OutputObject = {
  error: string | null,
  content: string,
}


export async function getCompilers(): Promise<CompilerObject[]> {
  return requester.get('/api/compilers');
}

export async function compileFile(file: FileObject, authorization: string): Promise<OutputObject> {
  const headers = { Authorization: authorization } as Partial<Headers>;
  return requester.post('/api/compile', JSON.stringify(file), headers);
}