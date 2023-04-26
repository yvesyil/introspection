import {
  Tree,
  TreeItem,
  TreeItemLayout,
} from "@fluentui/react-components/unstable";
import { Button, Input, tokens } from '@fluentui/react-components';
import WindowConfig from "../interfaces/window";
import { ChangeEvent, KeyboardEventHandler, useEffect, useState } from "react";
import { useAuthHeader, useAuthUser, useIsAuthenticated } from "react-auth-kit";
import { DirectoryObject, FileObject, deleteDirectory, deleteFile, getFile, getFileTreeOfUser, getFileTreeOfUser2, postDirectory, postFile } from "../api-calls/file-service";
import { DocumentAdd24Regular, FolderAdd24Regular, Delete24Regular } from "@fluentui/react-icons";
import { isEmpty } from "../utils";


function DirectoryActions({ directory, setNewDirectory, setNewFile, loadFileTree }: { 
    directory: DirectoryObject,
    setNewDirectory: any,
    setNewFile: any,
    loadFileTree: () => void,
  }) {
  const auth = useAuthUser();
  const authHeader = useAuthHeader();

  const addNewFile = async () => {
    let file: Partial<FileObject> = {
      userId: auth()!.id,
      content: '',
      name: '',
      type: 'text',
      directoryId: directory.id,
    };

    setNewFile(file);
  };

  const addNewDirectory = async () => {
    let dir: Partial<DirectoryObject> = {
      userId: auth()!.id,
      name: '',
      root: false,
      treeOfIds: {
        fileIds: [],
        directoryIds: [],
      },
      directoryId: directory.id,
    };

    setNewDirectory(dir);
  };

  const removeThisDirectory = async () => {
    await deleteDirectory(directory.id, authHeader());
    loadFileTree();
  };

  return (
    <>
      <Button aria-label="New Directory" onClick={addNewDirectory} appearance="subtle" icon={<FolderAdd24Regular />} />
      <Button aria-label="New File" onClick={addNewFile} appearance="subtle" icon={<DocumentAdd24Regular />} />
      {
        !directory.root ? (
          <Button aria-label="Delete" onClick={removeThisDirectory} appearance="subtle" icon={<Delete24Regular />} />
        ) : (
          <></>
        )
      }
    </>
  );
}

function FileActions({ id, loadFileTree }: { id: number, loadFileTree: () => void }) {
  const authHeader = useAuthHeader();

  const removeThisFile = async () => {
    await deleteFile(id, authHeader());
    loadFileTree();
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
  const [ newDirectory, setNewDirectory ] = useState({} as DirectoryObject);
  const [ newFile, setNewFile ] = useState({} as FileObject);

  const loadFileTree = async () => {
    setFileTree(await getFileTreeOfUser2(auth()!.id, authHeader()));
  };

  const loadFile = async (id: number) => {
    let file =  await getFile(id, authHeader());
    setOpenFile(file);
  };

  const buildTree = (dirs: DirectoryObject[]) => {
    return dirs.map((dir, id) => (
      <TreeItem key={id} actions={<DirectoryActions directory={dir} setNewDirectory={setNewDirectory} setNewFile={setNewFile} loadFileTree={() => loadFileTree()} />}>
        <TreeItemLayout id={`directory: ${dir.id}`}>{dir.name}</TreeItemLayout>
        {
          dir.tree.directories || dir.tree.files || !isEmpty(newDirectory) || !isEmpty(newFile) ? (
            <Tree>
              {
                !isEmpty(newDirectory) && newDirectory.directoryId === dir.id ? (
                  <Input
                    placeholder="enter name!"
                    aria-label="inline" 
                    onChange={(ev) => {
                      setNewDirectory({ ...newDirectory, name: ev.target.value });
                    }}
                    value={newDirectory.name}
                    onKeyDown={async (ev) => {
                      if (ev.key === 'Enter') {
                        await postDirectory(newDirectory, authHeader());
                        setNewDirectory({} as DirectoryObject);
                        loadFileTree();
                      }
                    }}
                  /> 
                ) : !isEmpty(newFile) && newFile.directoryId === dir.id ? (
                  <Input 
                    placeholder="enter name" 
                    aria-label="inline" 
                    onChange={(ev) => {
                      setNewFile({ ...newFile, name: ev.target.value });
                    }}
                    value={newFile.name}
                    onKeyDown={async (ev) => {
                      if (ev.key === 'Enter') {
                        await postFile(newFile, authHeader());
                        setNewFile({} as FileObject);
                        loadFileTree();
                      }
                    }}
                  />
                ) : (
                  <></>
                )
              }
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
                    <TreeItem key={id} actions={<FileActions id={file.id} loadFileTree={() => loadFileTree()} />}>
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