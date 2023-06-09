import { useEffect, useState } from "react";
import TopBar from "../components/TopBar";
import EditorBody from '../components/EditorBody';
import WindowConfig from "../interfaces/window";
import FileExplorer from "../components/FileTree";
import { useIsAuthenticated } from "react-auth-kit";
import useViewport from "../hooks/viewport";
import { FileObject } from "../api-calls/file-service";
import { OutputObject } from "../api-calls/compiler-service";


export default function RootPage() {
  const {width, height} = useViewport();
  const isAuthenticated = useIsAuthenticated();
  const [ openFile, setOpenFile ] = useState({} as FileObject);
  const [ output, setOutput ] = useState({} as OutputObject);

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
      <TopBar config={topBarConfig} openFile={openFile} setOutput={setOutput} />
      { 
        isAuthenticated() ? (
          <div style={{
            display: 'flex'
          }}>
            <FileExplorer 
              config={fileExplorerConfig} 
              openFile={openFile} 
              setOpenFile={setOpenFile} 
              />
            <EditorBody 
              config={editorBodyConfig} 
              openFile={openFile} 
              output={output} 
              setOpenFile={setOpenFile} 
              />
          </div>
        ) : (
          <EditorBody 
            config={editorBodyConfig}
            openFile={openFile} 
            output={output} 
            setOpenFile={setOpenFile} 
            />
        )
      }
    </>
  );
}