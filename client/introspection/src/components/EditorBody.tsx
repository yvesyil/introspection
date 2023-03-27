import Editor, { useMonaco } from "@monaco-editor/react";
import { useEffect } from "react";
import GithubDarkTheme from '../assets/github-dark.json';
import { editor } from "monaco-editor";

export default function EditorBody({ height }: { height: number }) {
  const editorFont = "'Source Code Pro', Menlo, Monaco, Consolas, 'Courier New', monospace";

  const defaultCode = `// paste your code here\n#include <stdio.h>\n\nint main(void)\n{\n\tprintf("Hello, World!");\n\treturn 0;\n}\n`;

  const monaco = useMonaco();

  useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme('github-dark', GithubDarkTheme as editor.IStandaloneThemeData);
      monaco.editor.setTheme('github-dark');
    }
  }, [monaco]);

  return (
    <div style={{
      display: 'flex',
      height: `${height}px`,
    }}>
      <Editor
        width="50vw"
        defaultLanguage="c"
        defaultValue={defaultCode}
        theme="vs-dark"
        options={{
          fontFamily: editorFont
        }}
      />
      <Editor
        width="50vw"
        defaultLanguage="plaintext"
        theme="vs-dark"
        options={{
          fontFamily: editorFont
        }}
      />
    </div>
  );
}