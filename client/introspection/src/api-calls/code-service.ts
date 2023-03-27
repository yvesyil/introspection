import { RequestService } from "./common";

const requester = new RequestService();

export type CodeSnippetObject = {
  id: number,
  name: string,
  type: string,
  content: string,
  directoryId: number,
  userId: number
}

export async function getCodeSnippetsOfUser(userId: number, authorization: string): Promise<CodeSnippetObject[]> {
  const headers = { Authorization: authorization } as Partial<Headers>;
  return await requester.get(`/api/files?userId=${userId}`, headers);
}

export async function saveCodeSnippet(snippet: CodeSnippetObject, authorization: string) {
  const headers = { Authorization: authorization } as Partial<Headers>;
  return await requester.post(`/api/files/${snippet.id}`, JSON.stringify(snippet), headers);
}