import Editor, { useMonaco } from "@monaco-editor/react";
import { useCallback, useEffect, useState } from "react";
import GithubDarkTheme from '../assets/github-dark.json';
import AsmSyntax from '../assets/x86asm';
import { editor } from "monaco-editor";
import { FileObject, putFile } from "../api-calls/file-service";
import { debounce } from "../utils";
import { useAuthUser, useIsAuthenticated, useAuthHeader } from "react-auth-kit";
import WindowConfig from "../interfaces/window";
import { OutputObject } from "../api-calls/compiler-service";

export default function EditorBody({ config, openFile, output, setOpenFile }: {
    config: WindowConfig,
    openFile: FileObject,
    output: OutputObject
    setOpenFile: (file: FileObject) => void,
  }) {

  const editorFont = "'Source Code Pro', Menlo, Monaco, Consolas, 'Courier New', monospace";
  const defaultCode = `// paste your code here\n#include <stdio.h>\n\nint main(void)\n{\n\tprintf("Hello, World!");\n\treturn 0;\n}\n`;

  const [ bufferedFile, setBufferedFile ] = useState(openFile);

  const monaco = useMonaco();
  const isAuthenticated = useIsAuthenticated();
  const auth = useAuthUser();
  const authHeader = useAuthHeader();

  const saveFile = useCallback(debounce(putFile, 2000), []);

  const handleFileChange = (value: string | undefined) => {
    if (bufferedFile === openFile) {
      // Same file edited
      const newfile = {
        ...bufferedFile,
        content: value as string,
      };

      setOpenFile(newfile);

      if (isAuthenticated()) {
        saveFile(newfile, authHeader());
      }
    } else {
      // changed file
      setOpenFile(openFile);

      if (isAuthenticated()) {
        saveFile(bufferedFile, authHeader());
      }
    }
  };

  useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme('github-dark', GithubDarkTheme as editor.IStandaloneThemeData);
      monaco.editor.setTheme('github-dark');
      monaco.languages.register({id: 'asm'});
      monaco.languages.setMonarchTokensProvider('asm', AsmSyntax);
    }
  }, [monaco]);


  useEffect(() => {
    setBufferedFile(openFile);
  }, [openFile]);

  useEffect(() => {

  });

  return (
    <div style={{
      display: 'flex',
      height: `${config.height}px`,
      width: `${config.width}px`,
      boxSizing: 'border-box',
    }}>
      <Editor
        width={`${config.width / 2}px`}
        defaultLanguage="c"
        value={bufferedFile.content}
        theme="vs-dark"
        options={{
          fontFamily: editorFont
        }}
        onChange={handleFileChange}
      />
      <Editor
        width={`${config.width / 2}px`}
        defaultLanguage="asm"
        theme="vs-dark"
        value={output.error ? output.error : output.content}
        options={{
          fontFamily: editorFont,
          readOnly: true,
        }}
      />
    </div>
  );
}