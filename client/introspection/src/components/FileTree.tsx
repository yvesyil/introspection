import {
  Tree,
  TreeItem,
  TreeItemLayout,
} from "@fluentui/react-components/unstable";
import { tokens } from '@fluentui/react-components';
import WindowConfig from "../interfaces/window";
import { useEffect, useState } from "react";
import { useAuthHeader, useAuthUser, useIsAuthenticated } from "react-auth-kit";
import { DirectoryObject, getFileTreeOfUser } from "../api-calls/code-service";

export default function FileExplorer({ config }: { config: WindowConfig }) {
  const isAuthenticated = useIsAuthenticated();
  const auth = useAuthUser();
  const authHeader = useAuthHeader();

  const [fileTree, setFileTree] = useState([] as DirectoryObject[]);

  const loadFileTree = async () => {
    console.log(await getFileTreeOfUser(auth()!.id, authHeader()))
    setFileTree(await getFileTreeOfUser(auth()!.id, authHeader()));
  };

  const buildTree = (dirs: DirectoryObject[]) => {
    return dirs.map((dir, id) => (
      <TreeItem>
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
                    <TreeItem>
                      <TreeItemLayout id={`file: ${file.id}`}>{file.name}</TreeItemLayout>
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