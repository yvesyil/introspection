import { RequestService } from "./common";

const requester = new RequestService();

export type FileObject = {
  id: number,
  userId: number,
  name: string,
  type: string,
  content: string,
  parentId: number,
}

type DirectoryTree = {
  files: FileObject[] | null,
  directories: DirectoryObject[] | null,
};

export type DirectoryObject = {
  id: number,
  userId: number,
  name: string,
  root: boolean,
  tree: DirectoryTree,
  parentId: number | null,
}

export async function getFile(fileId: number, authorization: string): Promise<FileObject> {
  const headers = { Authorization: authorization } as Partial<Headers>;
  return requester.get(`/api/files/${fileId}`, headers);
}

export async function getFilesOfDirectory(directoryId: number, authorization: string): Promise<FileObject[]> {
  const headers = { Authorization: authorization } as Partial<Headers>;
  return requester.get(`/api/files?parentId=${directoryId}`, headers);
}

export async function getFilesOfUser(userId: number, authorization: string) {
  const headers = { Authorization: authorization } as Partial<Headers>;
  return requester.get(`/api/files?userId=${userId}`, headers);
}

export async function getDirectory(directoryId: number, authorization: string) {
  const headers = { Authorization: authorization } as Partial<Headers>;
  return requester.get(`/api/directories/${directoryId}`, headers);
}

export async function getDirectoriesOfUser(userId: number, authorization: string): Promise<DirectoryObject[]> {
  const headers = { Authorization: authorization } as Partial<Headers>;
  return requester.get(`/api/directories?userId=${userId}`, headers);
}

export async function getDirectoriesOfDirectory(directoryId: number, authorization: string): Promise<DirectoryObject[]> {
  const headers = { Authorization: authorization } as Partial<Headers>;
  return requester.get(`/api/directories?parentId=${directoryId}`, headers);
}

export async function getRootDirectoriesOfUser(userId: number, authorization: string): Promise<DirectoryObject[]> {
  const headers = { Authorization: authorization } as Partial<Headers>;
  return requester.get(`/api/directories?userId=${userId}&root=true`, headers);
}

export async function getFileTreeOfUser(userId: number, authorization: string): Promise<DirectoryObject[]> {

  const buildDirectoryTree = async (dir: DirectoryObject) => {
    dir.tree = {
      directories: null,
      files: null,
    } as DirectoryTree;

    let directories = await getDirectoriesOfDirectory(dir.id, authorization);
    if (directories.length !== 0) {
      dir.tree.directories = [];
      for (let directory of directories) {
        await buildDirectoryTree(directory);
        dir.tree.directories.push(directory);
      }
    }

    let files = await getFilesOfDirectory(dir.id, authorization);
    if (files.length !== 0) {
      dir.tree.files = files;
    }
  }

  let directories = await getRootDirectoriesOfUser(userId, authorization);

  for (let directory of directories) {
    await buildDirectoryTree(directory);
  }

  return directories;
}

export async function putFile(file: FileObject, authorization: string) {
  const headers = { Authorization: authorization } as Partial<Headers>;
  return requester.put(`/api/files/${file.id}`, JSON.stringify(file), headers);
}

export async function putDirectory(directory: DirectoryObject, authorization: string) {
  const headers = { Authorization: authorization } as Partial<Headers>;
  return requester.put(`/api/directories/${directory.id}`, JSON.stringify(directory), headers);
}

export async function postFile(file: Partial<FileObject>, authorization: string) {
  const headers = { Authorization: authorization } as Partial<Headers>;
  return requester.post(`/api/files`, JSON.stringify(file), headers);
}

export async function postDirectory(directory: Partial<DirectoryObject>, authorization: string) {
  const headers = { Authorization: authorization } as Partial<Headers>;
  return requester.post(`/api/directories`, JSON.stringify(directory), headers);
}

export async function deleteFile(fileId: number, authorization: string) {
  const headers = { Authorization: authorization } as Partial<Headers>;
  return requester.delete(`/api/files/${fileId}`, headers);
}

export async function deleteDirectory(directoryId: number, authorization: string) {
  const headers = { Authorization: authorization } as Partial<Headers>;
  return requester.delete(`/api/directories/${directoryId}`, headers);
}