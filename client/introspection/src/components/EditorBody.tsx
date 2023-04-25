import Editor, { useMonaco } from "@monaco-editor/react";
import { useCallback, useEffect, useState } from "react";
import GithubDarkTheme from '../assets/github-dark.json';
import { editor } from "monaco-editor";
import { FileObject, getFilesOfUser, postFile } from "../api-calls/code-service";
import { debounce } from "../utils";
import { useAuthUser, useIsAuthenticated, useAuthHeader } from "react-auth-kit";
import WindowConfig from "../interfaces/window";

export default function EditorBody({ config }: { config: WindowConfig }) {

  const editorFont = "'Source Code Pro', Menlo, Monaco, Consolas, 'Courier New', monospace";
  const defaultCode = `// paste your code here\n#include <stdio.h>\n\nint main(void)\n{\n\tprintf("Hello, World!");\n\treturn 0;\n}\n`;

  const [codeSnippet, setCodeSnippet] = useState({content: defaultCode} as FileObject);
  const monaco = useMonaco();
  const isAuthenticated = useIsAuthenticated();
  const auth = useAuthUser();
  const authHeader = useAuthHeader();

  const handleCodeChange = (value: string | undefined) => {
    const changedSnippet: FileObject = {
      ...codeSnippet,
      content: value as string,
    };
    setCodeSnippet(changedSnippet);
  };

  const loadCodeSnippet = async () => {
    setCodeSnippet((await getFilesOfUser(auth()!.id, authHeader()))[0]);
  };

  const saveCodeSnippet = useCallback(debounce(postFile, 3000), []);

  useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme('github-dark', GithubDarkTheme as editor.IStandaloneThemeData);
      monaco.editor.setTheme('github-dark');
    }
  }, [monaco]);

  /*
  useEffect(() => {
    if (isAuthenticated()) {
      loadCodeSnippet();
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated()) {
      saveCodeSnippet(codeSnippet, authHeader());
    }
  }, [codeSnippet]);
  */

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
        value={codeSnippet.content}
        theme="vs-dark"
        options={{
          fontFamily: editorFont
        }}
        onChange={handleCodeChange}
      />
      <Editor
        width={`${config.width / 2}px`}
        defaultLanguage="plaintext"
        theme="vs-dark"
        options={{
          fontFamily: editorFont,
        }}
      />
    </div>
  );
}