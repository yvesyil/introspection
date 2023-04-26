import {
  Tree,
  TreeItem,
  TreeItemLayout,
} from "@fluentui/react-components/unstable";
import { Button, Input, tokens } from '@fluentui/react-components';
import WindowConfig from "../interfaces/window";
import { ChangeEvent, KeyboardEventHandler, useEffect, useState } from "react";
import { useAuthHeader, useAuthUser, useIsAuthenticated } from "react-auth-kit";
import { DirectoryObject, FileObject, deleteDirectory, getFile, getFileTreeOfUser, postDirectory, postFile } from "../api-calls/file-service";
import { DocumentAdd24Regular, FolderAdd24Regular, Delete24Regular } from "@fluentui/react-icons";
import { isEmpty } from "../utils";

function DirectoryActions({ id, }: { id: number }) {
  const auth = useAuthUser();
  const authHeader = useAuthHeader();

  const addNewFile = async () => {
    let file: Partial<FileObject> = {
      userId: auth()!.id,
      content: '',
      name: '',
      type: 'text',
      directoryId: id,
    };

    //await postFile(file, authHeader());
  };

  const addNewDirectory = async () => {
    let dir: Partial<DirectoryObject> = {
      userId: auth()!.id,
      name: '',
      treeOfIds: {
        fileIds: [],
        directoryIds: [],
      },
      directoryId: id,
    };

    //await postDirectory(dir, authHeader());
  };

  const removeThisDirectory = async () => {
    await deleteDirectory(id, authHeader());
  };

  return (
    <>
      <Button aria-label="New Directory" onClick={addNewDirectory} appearance="subtle" icon={<FolderAdd24Regular />} />
      <Button aria-label="New File" onClick={addNewFile} appearance="subtle" icon={<DocumentAdd24Regular />} />
      <Button aria-label="Delete" onClick={removeThisDirectory} appearance="subtle" icon={<Delete24Regular />} />
    </>
  );
}

function FileActions({ id }: { id: number }) {
  const authHeader = useAuthHeader();

  const removeThisFile = async () => {
    await deleteDirectory(id, authHeader());
  };

  return (
    <>
      <Button aria-label="Delete" onClick={removeThisFile} appearance="subtle" icon={<Delete24Regular />} />
    </>
  );
}

export default function FileExplorer({ config, openFile, setOpenFile }: { 
    config: WindowConfig, 
    openFile: FileObject,
    setOpenFile: (file: FileObject) => void
  }) {

  const isAuthenticated = useIsAuthenticated();
  const auth = useAuthUser();
  const authHeader = useAuthHeader();

  const [ fileTree, setFileTree ] = useState([] as DirectoryObject[]);

  const loadFileTree = async () => {
    setFileTree(await getFileTreeOfUser(auth()!.id, authHeader()));
  };

  const loadFile = async (id: number) => {
    let file =  await getFile(id, authHeader());
    setOpenFile(file);
  };

  const buildTree = (dirs: DirectoryObject[]) => {
    return dirs.map((dir, id) => (
      <TreeItem key={id} actions={<DirectoryActions id={dir.id} />}>
        <TreeItemLayout id={`directory: ${dir.id}`}>{dir.name}</TreeItemLayout>
        {
          dir.tree.directories || dir.tree.files ? (
            <Tree>
              {
                dir.tree.directories ? (
                  buildTree(dir.tree.directories)
                ) : (
                  <></>
                )
              }
              {
                dir.tree.files ? (
                  dir.tree.files.map((file, id) => (
                    <TreeItem key={id} actions={<FileActions id={file.id} />}>
                      <TreeItemLayout id={`file: ${file.id}`} onClick={async () => loadFile(file.id)}>{file.name}</TreeItemLayout>
                    </TreeItem>
                  ))
                ) : (
                  <></>
                )
              }
            </Tree>
          ) : (
            <></>
          )
        }
      </TreeItem>
    ));
  };

  useEffect(() => {
    if (isAuthenticated()) {
      loadFileTree();
    }
  }, []);

  return (
    <div style={{
      height: `${config.height}px`,
      width: `${config.width}px`,
      backgroundColor: tokens.colorNeutralBackground2
    }}>
      <Tree aria-label="Tree">
        {
          buildTree(fileTree)
        }
      </Tree>
    </div>
  );
};