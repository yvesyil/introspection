import { RequestService } from "./common";

const requester = new RequestService();

export type FileObject = {
  id: number,
  userId: number,
  name: string,
  type: string,
  content: string,
  directoryId: number,
}

type DirectoryTree = {
  files: FileObject[] | null,
  directories: DirectoryObject[] | null,
};

export type DirectoryObject = {
  id: number,
  userId: number,
  name: string,
  treeOfIds: {
    fileIds: number[],
    directoryIds: number[],
  },
  tree: DirectoryTree,
  directoryId: number | null,
}

export async function getFile(fileId: number, authorization: string): Promise<FileObject> {
  const headers = { Authorization: authorization } as Partial<Headers>;
  return requester.get(`/api/files/${fileId}`, headers);
}

export async function getFilesOfDirectory(directoryId: number, authorization: string): Promise<FileObject[]> {
  const headers = { Authorization: authorization } as Partial<Headers>;
  return requester.get(`/api/files?directoryId=${directoryId}`, headers);
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

    if (dir.treeOfIds.directoryIds.length !== 0) {
      dir.tree.directories = [];
      for (let directoryId of dir.treeOfIds.directoryIds) {
        let directory = await getDirectory(directoryId, authorization);
        await buildDirectoryTree(directory);
        dir.tree.directories.push(directory);
      }
    }

    if (dir.treeOfIds.fileIds.length !== 0) {
      dir.tree.files = [];
      for (let fileId of dir.treeOfIds.fileIds) {
        let file = await getFile(fileId, authorization);
        dir.tree.files.push(file);
      }
    }
  }

  let directories = await getRootDirectoriesOfUser(userId, authorization);

  for (let directory of directories) {
    await buildDirectoryTree(directory);
  }

  return directories;
}

export async function postFile(file: FileObject, authorization: string) {
  const headers = { Authorization: authorization } as Partial<Headers>;
  return requester.post(`/api/files/${file.id}`, JSON.stringify(file), headers);
}