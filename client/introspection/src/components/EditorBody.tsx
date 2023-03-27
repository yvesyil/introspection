import Editor, { useMonaco } from "@monaco-editor/react";
import { useEffect, useState } from "react";
import GithubDarkTheme from '../assets/github-dark.json';
import { editor } from "monaco-editor";
import { CodeSnippetObject, getCodeSnippetsOfUser, saveCodeSnippet } from "../api-calls/code-service";
import { debounce } from "../utils";
import { useAuthUser, useIsAuthenticated, useAuthHeader } from "react-auth-kit";

export default function EditorBody({ height }: { height: number }) {

  const editorFont = "'Source Code Pro', Menlo, Monaco, Consolas, 'Courier New', monospace";
  const defaultCode = `// paste your code here\n#include <stdio.h>\n\nint main(void)\n{\n\tprintf("Hello, World!");\n\treturn 0;\n}\n`;

  const [codeSnippet, setCodeSnippet] = useState({content: defaultCode} as CodeSnippetObject);
  const monaco = useMonaco();
  const isAuthenticated = useIsAuthenticated();
  const auth = useAuthUser();
  const authHeader = useAuthHeader();


  const handleCodeChange = (value: string | undefined) => {
    const changedSnippet: CodeSnippetObject = {
      ...codeSnippet,
      content: value as string,
    };
    setCodeSnippet(changedSnippet);
    if (isAuthenticated()) {
      (debounce(() => saveCodeSnippet(changedSnippet, authHeader()), 1000))();
    }
  };

  const loadCodeSnippet = async () => {
    setCodeSnippet((await getCodeSnippetsOfUser(auth()!.id, authHeader()))[0]);
  };

  useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme('github-dark', GithubDarkTheme as editor.IStandaloneThemeData);
      monaco.editor.setTheme('github-dark');
    }
  }, [monaco]);

  useEffect(() => {
    if (isAuthenticated()) {
      loadCodeSnippet();
    }
  }, []);

  return (
    <div style={{
      display: 'flex',
      height: `${height}px`,
    }}>
      <Editor
        width="50vw"
        defaultLanguage="c"
        value={codeSnippet.content}
        theme="vs-dark"
        options={{
          fontFamily: editorFont
        }}
        onChange={handleCodeChange}
      />
      <Editor
        width="50vw"
        defaultLanguage="plaintext"
        theme="vs-dark"
        options={{
          fontFamily: editorFont,
        }}
      />
    </div>
  );
}