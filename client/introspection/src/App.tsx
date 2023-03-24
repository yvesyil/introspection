import {
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogActions,
  DialogContent,
  Button,
} from "@fluentui/react-components";
import {editor} from 'monaco-editor';
import Editor, { useMonaco } from "@monaco-editor/react";
import { makeStyles, useId, Select } from '@fluentui/react-components';

import './App.css';
import GithubDarkTheme from './assets/github-dark.json';
import { useEffect } from "react";
import { Nav } from './components/Nav';


function App() {

  const editorFont = "'Source Code Pro', Menlo, Monaco, Consolas, 'Courier New', monospace";

  const defaultCode = `// paste your code here\n#include <stdio.h>\n\nint main(void)\n{\n\tprintf("Hello, World!");\n\treturn 0;\n}\n`;

  const monaco = useMonaco();

  useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme('github-dark', GithubDarkTheme as editor.IStandaloneThemeData);
      monaco.editor.setTheme('github-dark');
    }
  }, [monaco]);

  const heightOfMenu = 60;
  const heightOfEditor = window.innerHeight - heightOfMenu;

  return (
    <div id="container">
      <Nav height={60} />
      
      <div style={{
        display: 'flex',
        height: `${heightOfEditor}px`,
      }}>
        <Editor
          width="50vw"
          defaultLanguage="c"
          defaultValue={defaultCode}
          theme='vs-dark'
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
    </div>
  );
}

export default App;
