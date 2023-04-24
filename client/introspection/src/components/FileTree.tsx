import {
  Tree,
  TreeItem,
  TreeItemLayout,
} from "@fluentui/react-components/unstable";
import { tokens } from '@fluentui/react-components';
import * as React from "react";
import WindowConfig from "../interfaces/window";

export default function FileExplorer({ config }: { config: WindowConfig }) {
  return (
    <div style={{
      height: `${config.height}px`,
      width: `${config.width}px`,
      backgroundColor: tokens.colorNeutralBackground2
    }}>
      <Tree aria-label="Tree">
        <TreeItem>
          <TreeItemLayout>level 1, item 1</TreeItemLayout>
          <Tree>
            <TreeItem>
              <TreeItemLayout>level 2, item 1</TreeItemLayout>
            </TreeItem>
            <TreeItem>
              <TreeItemLayout>level 2, item 2</TreeItemLayout>
            </TreeItem>
            <TreeItem>
              <TreeItemLayout>level 2, item 3</TreeItemLayout>
            </TreeItem>
          </Tree>
        </TreeItem>
        <TreeItem>
          <TreeItemLayout>level 1, item 2</TreeItemLayout>
          <Tree>
            <TreeItem>
              <TreeItemLayout>level 2, item 1</TreeItemLayout>
              <Tree>
                <TreeItem>
                  <TreeItemLayout>level 3, item 1</TreeItemLayout>
                </TreeItem>
              </Tree>
            </TreeItem>
          </Tree>
        </TreeItem>
      </Tree>
    </div>
  );
};