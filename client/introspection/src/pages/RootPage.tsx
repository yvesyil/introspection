import { useEffect, useState } from "react";
import TopBar from "../components/TopBar";
import EditorBody from '../components/EditorBody';
import WindowConfig from "../interfaces/window";
import FileExplorer from "../components/FileTree";
import { useIsAuthenticated } from "react-auth-kit";
import useViewport from "../hooks/viewport";


//export default function RootPage({ config }: { config: WindowConfig }) {
export default function RootPage() {
  const {width, height} = useViewport();

  const isAuthenticated = useIsAuthenticated();

  const topBarConfig = {
    width: width,
    height: 60,
  } as WindowConfig;

  const fileExplorerConfig = {
    width: 300,
    height: height - topBarConfig.height,
  } as WindowConfig;

  const editorBodyConfig = {
    width: width,
    height: height - topBarConfig.height,
  } as WindowConfig;


  if (isAuthenticated()) {
    editorBodyConfig.width = width - fileExplorerConfig.width;
  }

  return (
    <>
      <TopBar config={topBarConfig} />
      { 
        isAuthenticated() ? (
          <div style={{
            display: 'flex'
          }}>
            <FileExplorer config={fileExplorerConfig} />
            <EditorBody config={editorBodyConfig} />
          </div>
        ) : (
          <EditorBody config={editorBodyConfig} />
        )
      }
    </>
  );
}