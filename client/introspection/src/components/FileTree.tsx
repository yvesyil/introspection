import {
  Tree,
  TreeItem,
  TreeItemLayout,
} from "@fluentui/react-components/unstable";
import { Button, tokens } from '@fluentui/react-components';
import WindowConfig from "../interfaces/window";
import { useEffect, useState } from "react";
import { useAuthHeader, useAuthUser, useIsAuthenticated } from "react-auth-kit";
import { DirectoryObject, FileObject, getFile, getFileTreeOfUser } from "../api-calls/file-service";

import { DocumentAdd24Regular, FolderAdd24Regular, Delete24Regular } from "@fluentui/react-icons";

function DirectoryActions() {
  return (
    <>
      <Button aria-label="New Folder" appearance="subtle" icon={<FolderAdd24Regular />} />
      <Button aria-label="New Document" appearance="subtle" icon={<DocumentAdd24Regular />} />
      <Button aria-label="Delete" appearance="subtle" icon={<Delete24Regular />} />
    </>
  );
}

function FileActions() {
  return (
    <>
      <Button aria-label="Delete" appearance="subtle" icon={<Delete24Regular />} />
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

  const [fileTree, setFileTree] = useState([] as DirectoryObject[]);

  const loadFileTree = async () => {
    setFileTree(await getFileTreeOfUser(auth()!.id, authHeader()));
  };

  const loadFile = async (id: number) => {
    let file =  await getFile(id, authHeader());
    setOpenFile(file);
  };

  const buildTree = (dirs: DirectoryObject[]) => {
    return dirs.map((dir, id) => (
      <TreeItem actions={<DirectoryActions />}>
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
                    <TreeItem actions={<FileActions />}>
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